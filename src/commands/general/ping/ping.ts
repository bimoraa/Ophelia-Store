/**
 * - PING COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { create_embed } from '../../../utils/embeds';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and response time'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes ping command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const sent = await interaction.reply({
            content:   'Pinging...',
            fetchReply: true
        });

        const latency     = sent.createdTimestamp - interaction.createdTimestamp;
        const api_latency = Math.round(interaction.client.ws.ping);

        const embed = create_embed({
            title:       'Pong',
            description: 'Bot latency information',
            color:       0x00FF00,
            fields:      [
                {
                    name:   'Roundtrip Latency',
                    value:  `${latency}ms`,
                    inline: true
                },
                {
                    name:   'WebSocket Latency',
                    value:  `${api_latency}ms`,
                    inline: true
                }
            ]
        });

        await interaction.editReply({
            content: '',
            embeds:  [embed]
        });
    }
};

export default command;
