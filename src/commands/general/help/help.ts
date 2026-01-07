/**
 * - HELP COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { create_simple_message } from '../../../utils/message_component_v2';
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

        const commands_text = commands
            .map(cmd => `**/${cmd.data.name}**\n${cmd.data.description}`)
            .join('\n\n');

        const message = create_simple_message(
            `## Available Commands\n\nList of all commands available in Ophelia Store Bot\n\n${commands_text}`
        );

        await interaction.reply({
            ...message,
            flags: 64
        } as any);
    }
};

export default command;
