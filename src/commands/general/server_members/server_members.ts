/**
 * - SERVER MEMBERS COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('server-members')
        .setDescription('Show server member counts'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes server-members command
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
            const total    = guild.memberCount;
            const humans   = guild.members.cache.filter(m => !m.user.bot).size;
            const bots     = total - humans;
            const boosts   = guild.premiumSubscriptionCount || 0;

            const content = "## Server Members\n" +
                            `Total: ${total}\n` +
                            `Humans: ${humans}\n` +
                            `Bots: ${bots}\n` +
                            `Boosts: ${boosts}`;

            await interaction.reply(
                build_component_reply(content, undefined, true) as any
            );
        } catch (error) {
            await log_error('Server Members Command Error', error as Error, {
                guild_id: interaction.guild.id,
                user:     interaction.user.tag
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch member counts.', undefined, true) as any
            );
        }
    }
};

export default command;
