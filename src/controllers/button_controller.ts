/**
 * - BUTTON INTERACTION CONTROLLER - \\
 */

import { ButtonInteraction } from 'discord.js';
import { build_component_reply } from '../utils/message_component_v2';
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
            await interaction.reply(build_component_reply('You clicked Primary button!', undefined, true) as any);
            return;
        }

        if (customId === 'example_success') {
            await interaction.reply(build_component_reply('You clicked Success button!', undefined, true) as any);
            return;
        }

        if (customId === 'example_danger') {
            await interaction.reply(build_component_reply('You clicked Danger button!', undefined, true) as any);
            return;
        }

        // - UNKNOWN BUTTON - \\
        await interaction.reply(build_component_reply('❌ Unknown button interaction', undefined, true) as any);

    } catch (error) {
        await log_error('Button Interaction Error', error as Error, {
            custom_id: interaction.customId,
            user:      interaction.user.tag
        });

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply(build_component_reply('❌ An error occurred while processing your request', undefined, true) as any);
        }
    }
};
