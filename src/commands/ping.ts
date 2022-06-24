import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Measures the bot's response time.");

export async function execute(interaction: CommandInteraction) {
    await interaction.reply(`${Date.now() - interaction.createdTimestamp}ms`);
}
