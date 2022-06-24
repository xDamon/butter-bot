import { Client, ClientOptions, Constants, Interaction, Snowflake } from "discord.js";
import { GuildExecuteFunction } from "~util";
import { Jukebox } from "./Jukebox";

export class ButterClient extends Client {
    public readonly jukeboxes: Map<Snowflake, Jukebox>;
    public readonly commands: Map<string, GuildExecuteFunction>;

    public constructor(options: ClientOptions) {
        super(options);

        this.jukeboxes = new Map();
        this.commands = new Map();

        this.once(Constants.Events.CLIENT_READY, () => this._onceReady());
        this.on(Constants.Events.INTERACTION_CREATE, (i) => this._onInteractionCreate(i));
    }

    private _onceReady() {
        console.log("Ready");
    }

    private async _onInteractionCreate(interaction: Interaction) {
        if (interaction.isCommand()) {
            if (!interaction.inGuild()) {
                await interaction.reply("You can only use this in guilds, sweety.")
            } else if (this.commands.has(interaction.commandName)) {
                await this.commands.get(interaction.commandName)!(interaction as any);
            } else {
                await interaction.reply("My owner is a fool.");
            }
        }
    }
}