/**
 * - SERVER BANNER COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('server-banner')
        .setDescription('Show the server banner'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes server-banner command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('❌ This command can only be used in a server!', undefined, true) as any
            );
            return;
        }

        try {
            const banner = interaction.guild.bannerURL({ size: 1024 }) || undefined;

            if (!banner) {
                await interaction.reply(
                    build_component_reply('❌ This server has no banner.', undefined, true) as any
                );
                return;
            }

            const content = "## Server Banner\n" +
                            `Server: ${interaction.guild.name}`;

            await interaction.reply(
                build_component_reply(content, banner, true) as any
            );
        } catch (error) {
            await log_error('Server Banner Command Error', error as Error, {
                guild_id: interaction.guild.id,
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch server banner.', undefined, true) as any
            );
        }
    }
};

export default command;
