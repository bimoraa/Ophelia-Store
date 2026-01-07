/**
 * - BUTTON INTERACTION CONTROLLER - \\
 */

import { ButtonInteraction } from 'discord.js';
import { create_simple_message } from '../utils/message_component_v2';
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
                ...create_simple_message('✅ You clicked Primary button!'),
                flags: 64
            } as any);
            return;
        }

        if (customId === 'example_success') {
            await interaction.reply({
                ...create_simple_message('✅ You clicked Success button!'),
                flags: 64
            } as any);
            return;
        }

        if (customId === 'example_danger') {
            await interaction.reply({
                ...create_simple_message('✅ You clicked Danger button!'),
                flags: 64
            } as any);
            return;
        }

        // - UNKNOWN BUTTON - \\
        await interaction.reply({
            ...create_simple_message('❌ Unknown button interaction'),
            flags: 64
        } as any);

    } catch (error) {
        await log_error('Button Interaction Error', error as Error, {
            custom_id: interaction.customId,
            user:      interaction.user.tag
        });

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                ...create_simple_message('❌ An error occurred while processing your request'),
                flags: 64
            } as any);
        }
    }
};
