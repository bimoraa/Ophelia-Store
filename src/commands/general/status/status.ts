/**
 * - STATUS COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import os from 'os';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Show bot status'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes status command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const mem_total = os.totalmem();
            const mem_free  = os.freemem();
            const mem_used  = mem_total - mem_free;
            const load      = os.loadavg()[0].toFixed(2);
            const ping      = Math.round(interaction.client.ws.ping);

            const content = "## Status\n" +
                            `WS Ping: ${ping}ms\n` +
                            `Load (1m): ${load}\n` +
                            `Memory Used: ${(mem_used / 1024 / 1024).toFixed(0)} MB / ${(mem_total / 1024 / 1024).toFixed(0)} MB`;

            await interaction.reply(
                build_component_reply(content, undefined, true) as any
            );
        } catch (error) {
            await log_error('Status Command Error', error as Error, {
                guild_id: interaction.guildId || 'DM',
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch status.', undefined, true) as any
            );
        }
    }
};

export default command;
