/**
 * - USER INFO COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Show user information')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Target user')
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes user-info command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const target = (interaction.options.getUser('user') || interaction.user) as User;

        try {
            const fetched   = await interaction.client.users.fetch(target.id, { force: true });
            const created   = fetched.createdAt.toISOString();
            const accent    = fetched.hexAccentColor || 'None';
            const banner    = fetched.bannerURL({ size: 1024, forceStatic: false }) || undefined;
            const avatar    = fetched.displayAvatarURL({ size: 1024, forceStatic: false }) || undefined;
            const media_url = banner || avatar;

            const content = "## User Info\n" +
                            `User: ${fetched.tag}\n` +
                            `ID: ${fetched.id}\n` +
                            `Created: ${created}\n` +
                            `Accent: ${accent}`;

            await interaction.reply(
                build_component_reply(content, media_url || undefined, true) as any
            );
        } catch (error) {
            await log_error('User Info Command Error', error as Error, {
                user:      interaction.user.tag,
                target_id: target.id,
                guild_id:  interaction.guildId || 'DM'
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch user info.', undefined, true) as any
            );
        }
    }
};

export default command;
