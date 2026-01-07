/**
 * - COLOR COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { from_hex } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Show a color preview')
        .addStringOption(option =>
            option
                .setName('hex')
                .setDescription('Hex color (e.g., #ff0000)')
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes color command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const hex = interaction.options.getString('hex', true);

        try {
            const numeric = from_hex(hex);
            const content = "## Color\n" +
                            `Hex: ${hex}\n` +
                            `Decimal: ${numeric}`;

            await interaction.reply(
                build_component_reply(content, undefined, true) as any
            );
        } catch (error) {
            await log_error('Color Command Error', error as Error, {
                guild_id: interaction.guildId || 'DM',
                user:     interaction.user.tag,
                hex
            });

            await interaction.reply(
                build_component_reply('❌ Invalid color input.', undefined, true) as any
            );
        }
    }
};

export default command;
