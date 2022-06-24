import { CommandInteraction } from "discord.js";
import { ButterClient } from "../framework/ButterClient";

export type GuildExecuteFunction = (i: GuildCommandInteraction) => Promise<unknown>;

export type GuildCommandInteraction = Omit<CommandInteraction<"cached">, "client"> & {
    client: ButterClient;
}
