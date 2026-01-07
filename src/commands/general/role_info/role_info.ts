/**
 * - ROLE INFO COMMAND - \\
 */

import { ChatInputCommandInteraction, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('role-info')
        .setDescription('Show role information')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Role to inspect')
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes role-info command
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
            const members_with_role = interaction.guild.members.cache.filter(m => m.roles.cache.has(role.id)).size;
            const hex_color         = role.hexColor || '#000000';

            const content = "## Role Info\n" +
                            `Name: ${role.name}\n` +
                            `ID: ${role.id}\n` +
                            `Color: ${hex_color}\n` +
                            `Position: ${role.position}\n` +
                            `Members: ${members_with_role}\n` +
                            `Mentionable: ${role.mentionable}\n` +
                            `Hoisted: ${role.hoist}`;

            await interaction.reply(
                build_component_reply(content, undefined, true) as any
            );
        } catch (error) {
            await log_error('Role Info Command Error', error as Error, {
                guild_id: interaction.guild.id,
                role_id:  role.id,
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch role info.', undefined, true) as any
            );
        }
    }
};

export default command;
