import { Intents } from "discord.js";
import { ButterClient } from "~framework";
import { createLogger } from "~util/logger";
import * as dotenv from "dotenv";
import * as commands from "~commands";

dotenv.config();;

const logger = createLogger(__filename);

const client = new ButterClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

const cmds = Object.values(commands);

for (const command of cmds) {
    client.commands.set(command.data.name, command.execute as any);
    logger.info(`Loaded command '${command.data.name}'`);
}

process.on("unhandledRejection", (err) => {
    logger.warn(`Unhandled rejection`, err);
});

client.login(process.env.DISCORD_TOKEN);
