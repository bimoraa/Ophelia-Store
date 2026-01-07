/**
 * - BUTTON INTERACTION CONTROLLER - \\
 */

import { ButtonInteraction } from 'discord.js';
import { create_success_embed, create_error_embed_simple } from '../utils/embeds';
import { log_error } from '../utils/error_logger';

/**
 * @param {ButtonInteraction} interaction - Button interaction
 * @returns {Promise<void>} Handles button interactions
 */
export const handle_button_interaction = async (
    interaction: ButtonInteraction
): Promise<void> => {
    try {
        const { customId } = interaction;

        // - EXAMPLE BUTTON HANDLERS - \\
        if (customId === 'example_primary') {
            await interaction.reply({
                embeds:    [create_success_embed('You clicked Primary button!')],
                ephemeral: true
            });
            return;
        }

        if (customId === 'example_success') {
            await interaction.reply({
                embeds:    [create_success_embed('You clicked Success button!')],
                ephemeral: true
            });
            return;
        }

        if (customId === 'example_danger') {
            await interaction.reply({
                embeds:    [create_success_embed('You clicked Danger button!')],
                ephemeral: true
            });
            return;
        }

        // - UNKNOWN BUTTON - \\
        await interaction.reply({
            embeds:    [create_error_embed_simple('Unknown button interaction')],
            ephemeral: true
        });

    } catch (error) {
        await log_error('Button Interaction Error', error as Error, {
            custom_id: interaction.customId,
            user:      interaction.user.tag
        });

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                embeds:    [create_error_embed_simple('An error occurred while processing your request')],
                ephemeral: true
            });
        }
    }
};
