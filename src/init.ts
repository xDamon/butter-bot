import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as dotenv from "dotenv";
import * as commands from "~commands";

dotenv.config();

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);
const data = Object.values(commands).map(c => c.data.toJSON());

rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!), { body: data })
	.then(() => console.log("Success"))
	.catch(err => console.error(err));
