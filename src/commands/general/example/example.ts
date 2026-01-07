/**
 * - EXAMPLE COMMAND WITH COMPONENTS V2 - \\
 */

import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    ButtonStyle 
} from 'discord.js';
import { Command } from '../../../types/command';
import { create_simple_message } from '../../../utils/message_component_v2';
import { create_button_row, create_select_menu_row } from '../../../utils/components';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('example')
        .setDescription('Example command showing Component v2 usage'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes example command with components v2
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const message = create_simple_message(
            '## Component v2 Example\n\nThis is an example showing proper Discord.js v14 Component v2 usage with buttons and select menus'
        );

        // - EXAMPLE BUTTON ROW - \\
        const button_row = create_button_row([
            {
                custom_id: 'example_primary',
                label:     'Primary',
                style:     ButtonStyle.Primary
            },
            {
                custom_id: 'example_success',
                label:     'Success',
                style:     ButtonStyle.Success
            },
            {
                custom_id: 'example_danger',
                label:     'Danger',
                style:     ButtonStyle.Danger
            }
        ]);

        // - EXAMPLE SELECT MENU - \\
        const select_row = create_select_menu_row({
            custom_id:   'example_select',
            placeholder: 'Choose an option',
            options:     [
                {
                    label:       'Option 1',
                    value:       'option_1',
                    description: 'First option'
                },
                {
                    label:       'Option 2',
                    value:       'option_2',
                    description: 'Second option'
                },
                {
                    label:       'Option 3',
                    value:       'option_3',
                    description: 'Third option'
                }
            ]
        });

        await interaction.reply({
            ...message,
            components: [button_row, select_row]
        });
    }
};

export default command;
