/**
 * - UPTIME COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const format_duration = (ms: number): string => {
    const sec  = Math.floor(ms / 1000) % 60;
    const min  = Math.floor(ms / (1000 * 60)) % 60;
    const hrs  = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hrs}h ${min}m ${sec}s`;
};

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Show bot uptime'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes uptime command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const uptime_ms = interaction.client.uptime || 0;
            const content   = "## Uptime\n" +
                              `Bot Uptime: ${format_duration(uptime_ms)}`;

            await interaction.reply(
                build_component_reply(content, undefined, true) as any
            );
        } catch (error) {
            await log_error('Uptime Command Error', error as Error, {
                guild_id: interaction.guildId || 'DM',
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch uptime.', undefined, true) as any
            );
        }
    }
};

export default command;
