import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { createLogger } from "~util/logger";
import * as dotenv from "dotenv";
import * as commands from "~commands";

dotenv.config();

const logger = createLogger(__filename);

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);
const cmds = Object.values(commands);
const data = cmds.map(c => c.data.toJSON());
const names = cmds.map(c => c.data.name).join(', ');

rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!), { body: data })
	.then(() => logger.info(`Successfully registered commands: ${names}`))
	.catch(err => logger.error('Unable to register commands', err));
