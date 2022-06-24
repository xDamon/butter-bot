import { Intents } from "discord.js";
import { ButterClient } from "~framework";
import * as dotenv from "dotenv";
import * as commands from "~commands";

dotenv.config();

const client = new ButterClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

const cmds = Object.values(commands);

for (const command of cmds) {
    client.commands.set(command.data.name, command.execute as any);
}

client.login(process.env.DISCORD_TOKEN);
