import { createAudioResource } from "@discordjs/voice";
import { stream } from "play-dl";

export class Track {
    private readonly _url: string;
    private readonly _title: string;

    public constructor(url: string, title: string) {
        this._url = url;
        this._title = title;
    }

    public async createAudioResource() {
        const streamable = await stream(this._url);

        return createAudioResource(streamable.stream, {
            inputType: streamable.type
        });
    }

    public toString() {
        return this._title;
    }
}