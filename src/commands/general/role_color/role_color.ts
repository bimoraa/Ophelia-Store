/**
 * - ROLE COLOR COMMAND - \\
 */

import { ChatInputCommandInteraction, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('role-color')
        .setDescription('Show the hex color of a role')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Role to check')
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes role-color command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('❌ This command can only be used in a server!', undefined, true) as any
            );
            return;
        }

        const role = interaction.options.getRole('role', true) as Role;

        try {
            const hex = role.hexColor || '#000000';

            const content = "## Role Color\n" +
                            `Role: ${role.name}\n` +
                            `Hex: ${hex}`;

            await interaction.reply(
                build_component_reply(content, undefined, true) as any
            );
        } catch (error) {
            await log_error('Role Color Command Error', error as Error, {
                guild_id: interaction.guild.id,
                role_id:  role.id,
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch role color.', undefined, true) as any
            );
        }
    }
};

export default command;
