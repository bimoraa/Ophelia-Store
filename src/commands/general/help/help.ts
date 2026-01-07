/**
 * - HELP COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { create_embed } from '../../../utils/embeds';
import { ExtendedClient } from '../../../types/client';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes help command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const client   = interaction.client as ExtendedClient;
        const commands = Array.from(client.commands.values());

        const embed = create_embed({
            title:       'Available Commands',
            description: 'List of all commands available in Ophelia Store Bot',
            color:       0x5865F2,
            fields:      commands.map(cmd => ({
                name:   `/${cmd.data.name}`,
                value:  cmd.data.description,
                inline: false
            }))
        });

        await interaction.reply({
            embeds:    [embed],
            ephemeral: true
        });
    }
};

export default command;
