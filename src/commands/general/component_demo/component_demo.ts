/**
 * - MESSAGE COMPONENT V2 EXAMPLE COMMAND - \\
 */

import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder
} from 'discord.js';
import { Command } from '../../../types/command';
import {
    create_component_v2,
    create_simple_message,
    create_titled_message,
    create_multi_section_message
} from '../../../utils/message_component_v2';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('component-demo')
        .setDescription('Demonstrate Component v2 message building')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Type of component demo')
                .setRequired(true)
                .addChoices(
                    { name: 'Simple Message', value: 'simple' },
                    { name: 'Titled Message', value: 'titled' },
                    { name: 'Multi Section', value: 'multi' },
                    { name: 'Custom Build', value: 'custom' }
                )
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes component demo command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const demo_type   = interaction.options.getString('type', true);
        const user_avatar = interaction.user.displayAvatarURL({ size: 256 });

        let message_component;

        switch (demo_type) {
            case 'simple':
                // - SIMPLE MESSAGE WITH TEXT AND IMAGE - \\
                message_component = create_simple_message(
                    'This is a simple message with your avatar!',
                    user_avatar
                );
                break;

            case 'titled':
                // - TITLED MESSAGE - \\
                message_component = create_titled_message(
                    'Component v2 Demo',
                    'This demonstrates a titled message with description and image.',
                    user_avatar
                );
                break;

            case 'multi':
                // - MULTI SECTION MESSAGE - \\
                message_component = create_multi_section_message([
                    {
                        content:   '## Section 1\nThis is the first section with your avatar.',
                        image_url: user_avatar
                    },
                    {
                        content: '## Section 2\nThis is the second section without an image.'
                    },
                    {
                        content:   '## Section 3\nThis is the third section with your avatar again.',
                        image_url: user_avatar
                    }
                ]);
                break;

            case 'custom':
                // - CUSTOM MANUAL BUILD USING BUILDER PATTERN - \\
                message_component = create_component_v2()
                    .add_container(container => {
                        container
                            .add_section(section => {
                                section
                                    .add_text('## Custom Build\nBuilt manually using builder pattern!')
                                    .add_media(user_avatar);
                            })
                            .add_section(section => {
                                section.add_text('This shows how to build Component v2 messages step by step.');
                            });
                    })
                    .build();
                break;

            default:
                message_component = create_simple_message('Unknown demo type');
        }

        await interaction.reply(message_component as any);
    }
};

export default command;
