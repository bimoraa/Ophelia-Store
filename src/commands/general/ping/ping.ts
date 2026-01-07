/**
 * - PING COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and response time'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes ping command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply(build_component_reply('Pinging...', undefined, true) as any);

        const sent        = await interaction.fetchReply();
        const latency     = sent.createdTimestamp - interaction.createdTimestamp;
        const api_latency = Math.round(interaction.client.ws.ping);

        await interaction.editReply(
            build_component_reply(
                "## Pong\n\n" +
                `- **Roundtrip Latency:** ${latency}ms\n` +
                `- **WebSocket Latency:** ${api_latency}ms`,
                undefined,
                true
            ) as any
        );
    }
};

export default command;
