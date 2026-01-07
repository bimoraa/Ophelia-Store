/**
 * - USER AVATAR COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('user-avatar')
        .setDescription('Show a user avatar')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Target user')
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes user-avatar command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const target = (interaction.options.getUser('user') || interaction.user) as User;

        try {
            const avatar  = target.displayAvatarURL({ size: 1024, forceStatic: false }) || undefined;
            const content = "## User Avatar\n" +
                            `User: ${target.tag}`;

            if (!avatar) {
                await interaction.reply(
                    build_component_reply('❌ Avatar not found for that user.', undefined, true) as any
                );
                return;
            }

            await interaction.reply(
                build_component_reply(content, avatar, true) as any
            );
        } catch (error) {
            await log_error('User Avatar Command Error', error as Error, {
                user:      interaction.user.tag,
                target_id: target.id,
                guild_id:  interaction.guildId || 'DM'
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch avatar.', undefined, true) as any
            );
        }
    }
};

export default command;
