/**
 * - AUTO ROLE ADD COMMAND - \\
 */

import { ChatInputCommandInteraction, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { upsert_auto_role } from '../../../models/auto_role';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('auto-role-add')
        .setDescription('Set a role to auto-assign on member join')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Role to auto-assign')
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes auto-role-add command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('❌ This command can only be used in a server!', undefined, true) as any
            );
            return;
        }

        const role = interaction.options.getRole('role', true) as Role;
        const bot_member = interaction.guild.members.me;

        if (!bot_member) {
            await interaction.reply(
                build_component_reply('❌ Unable to resolve bot member in this server.', undefined, true) as any
            );
            return;
        }

        if (role.managed) {
            await interaction.reply(
                build_component_reply('❌ That role is managed and cannot be assigned by the bot.', undefined, true) as any
            );
            return;
        }

        if (bot_member.roles.highest.comparePositionTo(role) <= 0) {
            await interaction.reply(
                build_component_reply('❌ Move the bot role above the target role so it can assign it.', undefined, true) as any
            );
            return;
        }

        try {
            await upsert_auto_role({
                guild_id: interaction.guild.id,
                role_id:  role.id
            });

            await interaction.reply(
                build_component_reply(
`## Auto role updated!
Role: <@&${role.id}>`,
                    undefined,
                    true
                ) as any
            );
        } catch (error) {
            await log_error('Auto Role Add Command Error', error as Error, {
                guild_id: interaction.guild.id,
                role_id:  role.id,
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to update auto role.', undefined, true) as any
            );
        }
    }
};

export default command;
