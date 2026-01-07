/**
 * - PING COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { create_simple_message } from '../../../utils/message_component_v2';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and response time'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes ping command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply(create_simple_message('Pinging...') as any);

        const sent        = await interaction.fetchReply();
        const latency     = sent.createdTimestamp - interaction.createdTimestamp;
        const api_latency = Math.round(interaction.client.ws.ping);

        const message = create_simple_message(
            `## Pong\n\n**Roundtrip Latency:** ${latency}ms\n**WebSocket Latency:** ${api_latency}ms`
        );

        await interaction.editReply(message as any);
    }
};

export default command;
