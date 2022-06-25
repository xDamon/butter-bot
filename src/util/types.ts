import { CreateVoiceConnectionOptions, JoinVoiceChannelOptions, VoiceConnection, VoiceConnectionState } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";
import { ButterClient } from "~framework/ButterClient";

export type GuildExecuteFunction = (i: GuildCommandInteraction) => Promise<unknown>;

export type GuildCommandInteraction = Omit<CommandInteraction<"cached">, "client"> & {
    client: ButterClient;
}

interface StateChangeVoiceConnection {
    on: (event: "stateChange", fn: (oldState: VoiceConnectionState, newState: VoiceConnectionState) => unknown) => this;
}

export type FixedVoiceConnection = VoiceConnection & StateChangeVoiceConnection;


declare module "@discordjs/voice" {
    function joinVoiceChannel(options: JoinVoiceChannelOptions & CreateVoiceConnectionOptions): FixedVoiceConnection;
}