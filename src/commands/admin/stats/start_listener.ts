/**
 * - START LISTENER COMMAND - \\
 */

import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    VoiceChannel
} from 'discord.js';
import { Command } from '../../../types/command';
import { upsert_server_stat } from '../../../models/server_stats';
import { build_component_reply } from '../../../utils/message_component_v2';
import { update_all_server_stats } from '../../../utils/server_stats_updater';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('start-listener')
        .setDescription('Setup auto-updating server stats in voice channels')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Type of stat to track')
                .setRequired(true)
                .addChoices(
                    { name: 'All Members', value: 'ALL_MEMBERS' },
                    { name: 'Members (No Bots)', value: 'MEMBERS' },
                    { name: 'Server Boosts', value: 'SERVER_BOOST' }
                )
        )
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('Text format (use {COUNT} placeholder)')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Voice channel to update (will create new if not specified)')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes start-listener command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply(
                build_component_reply('❌ This command can only be used in a server!', undefined, true) as any
            );
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const stat_type   = interaction.options.getString('type', true) as 'ALL_MEMBERS' | 'MEMBERS' | 'SERVER_BOOST';
            const text_format = interaction.options.getString('text', true);
            let channel       = interaction.options.getChannel('channel') as VoiceChannel | null;

            if (!text_format.includes('{COUNT}')) {
                await interaction.editReply(
                    build_component_reply(
                        '❌ Text format must include {COUNT} placeholder!',
                        undefined,
                        true
                    ) as any
                );
                return;
            }

            if (!channel) {
                const count       = stat_type === 'ALL_MEMBERS' ? interaction.guild.memberCount :
                                    stat_type === 'MEMBERS' ? interaction.guild.members.cache.filter(m => !m.user.bot).size :
                                    interaction.guild.premiumSubscriptionCount || 0;
                const channel_name = text_format.replace('{COUNT}', count.toString());

                channel = await interaction.guild.channels.create({
                    name:                   channel_name,
                    type:                   ChannelType.GuildVoice,
                    permissionOverwrites:   [
                        {
                            id:   interaction.guild.id,
                            deny: ['Connect']
                        }
                    ]
                });

                console.log(`[ - STATS - ] Created voice channel: ${channel.name}`);
            }

            await upsert_server_stat({
                guild_id:    interaction.guild.id,
                channel_id:  channel.id,
                stat_type:   stat_type,
                text_format: text_format,
                enabled:     true
            });

            await update_all_server_stats(interaction.guild);

            const type_display = stat_type.replace('_', ' ');

            await interaction.editReply(
                build_component_reply(
                    "## Server stats listener started!\n" +
                    `- Type: **${type_display}**\n` +
                    `- Channel: <#${channel.id}>\n` +
                    `- Format: **${text_format}**`,
                    'https://cdn.discordapp.com/attachments/1234567890/atomic_logo.png',
                    true
                ) as any
            );

        } catch (error) {
            await log_error('Start Listener Command Error', error as Error, {
                guild_id: interaction.guild.id,
                user:     interaction.user.tag
            });

            await interaction.editReply(
                build_component_reply('❌ An error occurred while setting up the listener', undefined, true) as any
            );
        }
    }
};

export default command;
