import { SlashCommandBuilder } from "@discordjs/builders";
import { ButterClient } from "~framework";
import { GuildCommandInteraction } from "~util";

export const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Skips a song if there is one playing.");

export async function execute(interaction: GuildCommandInteraction) {
    const jukeboxes = (interaction.client as ButterClient).jukeboxes;
    const jukebox = jukeboxes.get(interaction.guildId);
    const member = await interaction.guild!.members.fetch(interaction.user.id);

    if (!jukebox) {
        await interaction.reply("Nothing is playing ya doof.");
    } else if (jukebox.channelId === member.voice.channelId) {
        jukebox.stop();
        await interaction.reply("Stopping...");
    } else {
        await interaction.reply("Nice try champ, wrong voice channel.");
    }
}
