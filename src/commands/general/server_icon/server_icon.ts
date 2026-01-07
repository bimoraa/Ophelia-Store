/**
 * - SERVER ICON COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('server-icon')
        .setDescription('Show the server icon'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes server-icon command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('❌ This command can only be used in a server!', undefined, true) as any
            );
            return;
        }

        try {
            const icon = interaction.guild.iconURL({ size: 1024, forceStatic: false }) || undefined;

            if (!icon) {
                await interaction.reply(
                    build_component_reply('❌ This server has no icon.', undefined, true) as any
                );
                return;
            }

            const content = "## Server Icon\n" +
                            `Server: ${interaction.guild.name}`;

            await interaction.reply(
                build_component_reply(content, icon, true) as any
            );
        } catch (error) {
            await log_error('Server Icon Command Error', error as Error, {
                guild_id: interaction.guild.id,
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch server icon.', undefined, true) as any
            );
        }
    }
};

export default command;
