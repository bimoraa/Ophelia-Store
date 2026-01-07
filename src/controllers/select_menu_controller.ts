/**
 * - SELECT MENU INTERACTION CONTROLLER - \\
 */

import { StringSelectMenuInteraction } from 'discord.js';
import { build_component_reply } from '../utils/message_component_v2';
import { log_error } from '../utils/error_logger';

/**
 * @param {StringSelectMenuInteraction} interaction - Select menu interaction
 * @returns {Promise<void>} Handles select menu interactions
 */
export const handle_select_menu_interaction = async (
    interaction: StringSelectMenuInteraction
): Promise<void> => {
    try {
        const { customId, values } = interaction;

        // - EXAMPLE SELECT MENU HANDLER - \\
        if (customId === 'example_select') {
            const selected_value = values[0];
            
            await interaction.reply(build_component_reply(`You selected: ${selected_value}`, undefined, true) as any);
            return;
        }

        // - UNKNOWN SELECT MENU - \\
        await interaction.reply(build_component_reply('❌ Unknown select menu interaction', undefined, true) as any);

    } catch (error) {
        await log_error('Select Menu Interaction Error', error as Error, {
            custom_id: interaction.customId,
            user:      interaction.user.tag,
            values:    interaction.values.join(', ')
        });

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply(build_component_reply('❌ An error occurred while processing your request', undefined, true) as any);
        }
    }
};
