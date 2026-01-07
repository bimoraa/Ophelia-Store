/**
 * - BOT INFO COMMAND - \\
 */

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../../types/command';
import { build_component_reply } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Show bot information'),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes bot-info command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const client      = interaction.client;
            const bot_user    = client.user;
            const guild_count = client.guilds.cache.size;
            const ping        = Math.round(client.ws.ping);

            const content = "## Bot Info\n" +
                            `Name: ${bot_user?.tag || 'Unknown'}\n` +
                            `ID: ${bot_user?.id || 'Unknown'}\n` +
                            `Servers: ${guild_count}\n` +
                            `WS Ping: ${ping}ms`;

            const avatar = bot_user?.displayAvatarURL({ size: 1024 }) || undefined;

            await interaction.reply(
                build_component_reply(content, avatar, true) as any
            );
        } catch (error) {
            await log_error('Bot Info Command Error', error as Error, {
                user:     interaction.user.tag,
                guild_id: interaction.guildId || 'DM'
            });

            await interaction.reply(
                build_component_reply('❌ Failed to fetch bot info.', undefined, true) as any
            );
        }
    }
};

export default command;
