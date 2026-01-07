/**
 * - CHANNEL INFO COMMAND - \\
 */

import { ChatInputCommandInteraction, GuildBasedChannel, SlashCommandBuilder, TextChannel, VoiceChannel } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('channel-info')
        .setDescription('Show channel information')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Channel to inspect (defaults to current)')
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes channel-info command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('[ - ERROR - ] This command can only be used in a server.', undefined, true) as any
            );
            return;
        }

        const channel_option = interaction.options.getChannel('channel');
        const channel = (channel_option as GuildBasedChannel | null) || (interaction.channel as GuildBasedChannel | null);

        if (!channel) {
            await interaction.reply(
                build_component_reply('[ - ERROR - ] Channel not found.', undefined, true) as any
            );
            return;
        }

        try {
            const name       = channel.name || 'Unknown';
            const id         = channel.id;
            const type       = channel.type;
            const created    = channel.createdAt?.toISOString() || 'Unknown';
            const is_nsfw    = 'nsfw' in channel ? channel.nsfw : false;
            const topic      = channel instanceof TextChannel ? (channel.topic || 'None') : 'N/A';
            const bitrate    = channel instanceof VoiceChannel ? `${channel.bitrate} bps` : 'N/A';
            const user_limit = channel instanceof VoiceChannel ? (channel.userLimit || 0) : 0;

            const content = "## Channel Info\n" +
                            `Name: ${name}\n` +
                            `ID: ${id}\n` +
                            `Type: ${type}\n` +
                            `Created: ${created}\n` +
                            `NSFW: ${is_nsfw}\n` +
                            `Topic: ${topic}\n` +
                            `Bitrate: ${bitrate}\n` +
                            `User Limit: ${user_limit}`;

            await interaction.reply(
                build_component_reply(content, undefined, true) as any
            );
        } catch (error) {
            await log_error('Channel Info Command Error', error as Error, {
                guild_id:  interaction.guild.id,
                channel_id: channel.id,
                user:      interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('[ - ERROR - ] Failed to fetch channel info.', undefined, true) as any
            );
        }
    }
};

export default command;
