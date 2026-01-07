/**
 * - USER BANNER COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('user-banner')
        .setDescription('Show a user banner')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Target user')
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes user-banner command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const target = (interaction.options.getUser('user') || interaction.user) as User;

        try {
            const fetched = await interaction.client.users.fetch(target.id, { force: true });
            const banner  = fetched.bannerURL({ size: 1024, forceStatic: false }) || undefined;

            if (!banner) {
                await interaction.reply(
                    build_component_reply('❌ Banner not found for that user.', undefined, true) as any
                );
                return;
            }

            const content = "## User Banner\n" +
                            `User: ${target.tag}`;

            await interaction.reply(
                build_component_reply(content, banner, true) as any
            );
        } catch (error) {
            await log_error('User Banner Command Error', error as Error, {
                user:      interaction.user.tag,
                target_id: target.id,
                guild_id:  interaction.guildId || 'DM'
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch banner.', undefined, true) as any
            );
        }
    }
};

export default command;
