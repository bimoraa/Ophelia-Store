/**
 * - SERVER INFO COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Show server information'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes server-info command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('❌ This command can only be used in a server!', undefined, true) as any
            );
            return;
        }

        try {
            const guild    = interaction.guild;
            const owner_id = guild.ownerId;
            const members  = guild.memberCount;
            const created  = guild.createdAt.toISOString();

            const content = "## Server Info\n" +
                            `Name: ${guild.name}\n` +
                            `ID: ${guild.id}\n` +
                            `Owner ID: ${owner_id}\n` +
                            `Members: ${members}\n` +
                            `Created: ${created}`;

            const media = guild.iconURL({ size: 1024, forceStatic: false }) || undefined;

            await interaction.reply(
                build_component_reply(content, media, true) as any
            );
        } catch (error) {
            await log_error('Server Info Command Error', error as Error, {
                guild_id: interaction.guild.id,
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch server info.', undefined, true) as any
            );
        }
    }
};

export default command;
