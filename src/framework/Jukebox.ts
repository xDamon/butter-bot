import { EventEmitter } from "events";
import { promisify } from "util";
import { Snowflake } from "discord.js";
import { Track } from "./Track";
import {
    AudioPlayer,
    AudioPlayerStatus,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionState,
    VoiceConnectionStatus
} from "@discordjs/voice";

const wait = promisify(setTimeout);

export class Jukebox extends EventEmitter {
    public readonly channelId: Snowflake;

    private readonly _connection: VoiceConnection;
    private readonly _player: AudioPlayer;
    private readonly _queue: Track[];

    public constructor(channelId: Snowflake, connection: VoiceConnection, player: AudioPlayer) {
        super();

        this.channelId = channelId;
        this._connection = connection;
        this._player = player;
        this._queue = [];
    
        this._connection.on(VoiceConnectionStatus.Signalling, this._onConnectionStateChange.bind(this));
        this._player.on(AudioPlayerStatus.Idle, this._onAudioPlayerIdle.bind(this));

        this._connection.subscribe(this._player);
    }

    public isPlaying() {
        return this._player.state.status === AudioPlayerStatus.Playing
    }

    public enqueue(track: Track) {
        this._queue.push(track);
    }

    public skip() {
        if (this.isPlaying()) {
            this._player.stop(true);
        }
    }

    public stop() {
        if (this._connection.state.status !== VoiceConnectionStatus.Destroyed) {
            this._connection.destroy();
        }
    }

    public async play() {
        if (!this.isPlaying() && this._connection.state.status !== VoiceConnectionStatus.Destroyed) {
            if (!this._queue.length) {
                this._connection.destroy();
            } else {
                const track = this._queue.shift()!;
                const resource = await track.createAudioResource();

                this._player.play(resource);
            }
        }
    }

    public async transition(status: VoiceConnectionStatus, timeout: number) {
        try {
            await entersState(this._connection, status, timeout);
        } catch {
            if (this._connection.state.status !== VoiceConnectionStatus.Destroyed) {
                this._connection.destroy();
            }
        }
    }

    private async _onConnectionStateChange(oldState: VoiceConnectionState, newState: VoiceConnectionState) {
        if (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling) {
            await this.transition(VoiceConnectionStatus.Ready, 20000);
        } else if (newState.status === VoiceConnectionStatus.Destroyed) {
            this._queue.length = 0;
            this._player.stop(true);
            this.emit("finish");
        } else if (newState.status === VoiceConnectionStatus.Disconnected) {
            if (newState.reason == VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                await this.transition(VoiceConnectionStatus.Connecting, 5000);
            } else if (this._connection.rejoinAttempts < 5) {
                await wait((this._connection.rejoinAttempts + 1) * 5000).then(() => this._connection.rejoin());
            } else {
                this._connection.destroy();
            }
        }
    }

    private async _onAudioPlayerIdle() {
        await this.play();
    }
}