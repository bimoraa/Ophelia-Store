/**
 * - SELECT MENU INTERACTION CONTROLLER - \\
 */

import { StringSelectMenuInteraction } from 'discord.js';
import { create_success_embed, create_error_embed_simple } from '../utils/embeds';
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
            
            await interaction.reply({
                embeds:    [create_success_embed(`You selected: ${selected_value}`)],
                ephemeral: true
            });
            return;
        }

        // - UNKNOWN SELECT MENU - \\
        await interaction.reply({
            embeds:    [create_error_embed_simple('Unknown select menu interaction')],
            ephemeral: true
        });

    } catch (error) {
        await log_error('Select Menu Interaction Error', error as Error, {
            custom_id: interaction.customId,
            user:      interaction.user.tag,
            values:    interaction.values.join(', ')
        });

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                embeds:    [create_error_embed_simple('An error occurred while processing your request')],
                ephemeral: true
            });
        }
    }
};
