/**
 * - EXAMPLE COMMAND WITH COMPONENTS V2 - \\
 */

import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    ButtonStyle 
} from 'discord.js';
import { Command } from '../../../types/command';
import { create_embed } from '../../../utils/embeds';
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
        const embed = create_embed({
            title:       'Component v2 Example',
            description: 'This is an example showing proper Discord.js v14 Component v2 usage',
            color:       0x5865F2
        });

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
            embeds:     [embed],
            components: [button_row, select_row]
        });
    }
};

export default command;
