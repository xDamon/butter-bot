import { Client, ClientOptions, Constants, Interaction, Snowflake } from "discord.js";
import { GuildExecuteFunction } from "~util";
import { createLogger } from "~util/logger";
import { Jukebox } from "./Jukebox";

const logger = createLogger(__filename);
export class ButterClient extends Client {
    public readonly jukeboxes: Map<Snowflake, Jukebox>;
    public readonly commands: Map<string, GuildExecuteFunction>;

    public constructor(options: ClientOptions) {
        super(options);

        this.jukeboxes = new Map();
        this.commands = new Map();

        this.once(Constants.Events.CLIENT_READY, () => this._onceReady());
        this.on(Constants.Events.INTERACTION_CREATE, (i) => this._onInteractionCreate(i));
        this.on(Constants.Events.ERROR, (e) => this._onError(e));
    }

    private _onceReady() {
        logger.info('Client is ready');
    }

    private _onError(err: Error) {
        logger.error(`Unexpected error occurred`, err);
    }

    private async _onInteractionCreate(interaction: Interaction) {
        logger.debug(`Receieved interaction in guild ${interaction.guildId}`);

        if (interaction.isCommand()) {
            if (!interaction.inGuild()) {
                await interaction.reply("You can only use this in guilds, sweety.")
            } else if (this.commands.has(interaction.commandName)) {
                const name = interaction.commandName;
                const command = this.commands.get(name)!;

                logger.info(`Executing command '${name}'`);

                try {
                    await command(interaction as any);
                } catch (err) {
                    logger.error(`'${name}' command failed`, err);
                }
            } else {
                await interaction.reply("My owner is a fool.");
            }
        }
    }
}