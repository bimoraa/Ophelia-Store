/**
 * - INTERACTION CREATE EVENT HANDLER - \\
 */

import { Client, Events, Interaction } from 'discord.js';
import { ExtendedClient } from '../types/client';
import { log_error } from '../utils/error_logger';
import { handle_button_interaction } from '../controllers/button_controller';
import { handle_select_menu_interaction } from '../controllers/select_menu_controller';
import { create_simple_message } from '../utils/message_component_v2';

/**
 * @param {Client} client - Discord client instance
 * @returns {void} Registers interaction create event handler
 */
export const register_interaction_event = (client: Client): void => {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        const extended_client = client as ExtendedClient;

        // - HANDLE CHAT INPUT COMMANDS - \\
        if (interaction.isChatInputCommand()) {
            const command = extended_client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`[ - ERROR - ] No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
                console.log(`[ - COMMAND - ] ${interaction.user.tag} executed /${interaction.commandName}`);
            } catch (error) {
                await log_error('Command Execution Error', error as Error, {
                    command:  interaction.commandName,
                    user:     interaction.user.tag,
                    guild_id: interaction.guildId || 'DM'
                });

                const error_message = {
                    ...create_simple_message('❌ There was an error while executing this command!'),
                    flags: 64
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(error_message as any);
                } else {
                    await interaction.reply(error_message as any);
                }
            }
        }

        // - HANDLE AUTOCOMPLETE - \\
        if (interaction.isAutocomplete()) {
            const command = extended_client.commands.get(interaction.commandName);

            if (!command || !command.autocomplete) {
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                await log_error('Autocomplete Error', error as Error, {
                    command:  interaction.commandName,
                    user:     interaction.user.tag,
                    guild_id: interaction.guildId || 'DM'
                });
            }
        }

        // - HANDLE BUTTON INTERACTIONS - \\
        if (interaction.isButton()) {
            await handle_button_interaction(interaction);
            return;
        }

        // - HANDLE SELECT MENU INTERACTIONS - \\
        if (interaction.isStringSelectMenu()) {
            await handle_select_menu_interaction(interaction);
            return;
        }
    });
};
