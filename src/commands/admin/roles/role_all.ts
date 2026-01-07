/**
 * - ROLE ALL COMMAND - \\
 */

import { ChatInputCommandInteraction, PermissionFlagsBits, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('role-all')
        .setDescription('Assign a role to all non-bot members in the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Role to assign')
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes role-all command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('❌ This command can only be used in a server.', undefined, true) as any
            );
            return;
        }

        const role       = interaction.options.getRole('role', true) as Role;
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

        await interaction.deferReply({ flags: 64 });

        try {
            // - FETCH MEMBERS AND ASSIGN ROLE - \
            const members = await interaction.guild.members.fetch();
            const targets = members.filter(member => !member.user.bot && !member.roles.cache.has(role.id));

            if (targets.size === 0) {
                await interaction.followUp(
                    build_component_reply('All eligible members already have that role.', undefined, true) as any
                );
                return;
            }

            let success_count = 0;
            let failed_count  = 0;

            for (const [member_id, member] of targets) {
                try {
                    await member.roles.add(role, 'Role all command');
                    success_count += 1;
                } catch (assign_error) {
                    failed_count += 1;
                    await log_error('Role All Assignment Error', assign_error as Error, {
                        guild_id: interaction.guild.id,
                        role_id:  role.id,
                        member_id
                    });
                }
            }

            const summary = `## Role assignment completed
Role: <@&${role.id}>
Total targeted: ${targets.size}
Success: ${success_count}
Failed: ${failed_count}`;

            await interaction.followUp(
                build_component_reply(summary, undefined, true) as any
            );
        } catch (error) {
            await log_error('Role All Command Error', error as Error, {
                guild_id: interaction.guild.id,
                role_id:  role.id,
                user:     interaction.user.tag
            });

            await interaction.followUp(
                build_component_reply('❌ Failed to assign the role to all members.', undefined, true) as any
            );
        }
    }
};

export default command;
