import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { search } from "play-dl";
import { Jukebox, Track } from "~framework";
import { GuildCommandInteraction } from "~util";
import {
    createAudioPlayer,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    NoSubscriberBehavior,
} from "@discordjs/voice";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Joins a voice channel and plays a song.")
    .addStringOption(new SlashCommandStringOption()
        .setName("song")
        .setDescription("The song to play.")
        .setRequired(true)
    );

export async function execute(interaction: GuildCommandInteraction) {
    await interaction.deferReply();

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const jukeboxes = interaction.client.jukeboxes;

    if (member.voice.channelId) {
        const song = interaction.options.getString("song")!;
        const info = await search(song, { limit: 1, source: { youtube: "video" } });

        if (info.length) {
            let jukebox = jukeboxes.get(interaction.guildId);

            if (!jukebox) {
                jukebox = createJukebox(member);
                jukebox.once("finish", () => {
                    jukeboxes.delete(interaction.guildId);
                });
        
                jukeboxes.set(interaction.guildId, jukebox);
            }
        
            const track = new Track(info[0].url, info[0].title ?? song);
        
            jukebox.enqueue(track);
            jukebox.play();
        
            await interaction.editReply(`Queued - ${track} `);
        } else {
            await interaction.editReply("Couldn't find that one, buddy.");
        }
    } else {
        await interaction.editReply("You are not in a voice channel mate...");
    }
}

function createJukebox(member: GuildMember) {
    return new Jukebox(member.voice.channelId!,
        joinVoiceChannel({
            channelId: member.voice.channelId!,
            guildId: member.guild.id,
            adapterCreator: member.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
        }),
        createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })
    );
}