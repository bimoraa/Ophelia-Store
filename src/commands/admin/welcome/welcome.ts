/**
 * - WELCOME SETUP COMMAND - \\
 */

import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    TextChannel
} from 'discord.js';
import { Command } from '../../../types/command';
import { 
    get_welcome_settings, 
    upsert_welcome_settings, 
    update_welcome_enabled,
    update_welcome_message 
} from '../../../models/welcome_settings';
import { create_simple_message } from '../../../utils/message_component_v2';
import { log_error } from '../../../utils/error_logger';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configure welcome messages for new members')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup welcome channel')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Channel to send welcome messages')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disable welcome messages')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('enable')
                .setDescription('Enable welcome messages')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Set custom welcome message')
                .addStringOption(option =>
                    option
                        .setName('text')
                        .setDescription('Custom message (use {user}, {server}, {username})')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test welcome message with your account')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Show current welcome settings')
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction - Command interaction
     * @returns {Promise<void>} Executes welcome command
     */
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guildId) {
            await interaction.reply({
                ...create_simple_message('❌ This command can only be used in a server!'),
                flags: 64
            } as any);
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        try {
            // - SETUP SUBCOMMAND - \\
            if (subcommand === 'setup') {
                const channel = interaction.options.getChannel('channel', true) as TextChannel;

                await upsert_welcome_settings({
                    guild_id:   interaction.guildId,
                    channel_id: channel.id,
                    enabled:    true
                });

                await interaction.reply({
                    ...create_simple_message(`✅ Welcome messages will be sent to ${channel}`),
                    flags: 64
                } as any);
                return;
            }

            // - DISABLE SUBCOMMAND - \\
            if (subcommand === 'disable') {
                const settings = await update_welcome_enabled(interaction.guildId, false);

                if (!settings) {
                    await interaction.reply({
                        ...create_simple_message('❌ Welcome system is not configured yet. Use `/welcome setup` first.'),
                        flags: 64
                    } as any);
                    return;
                }

                await interaction.reply({
                    ...create_simple_message('✅ Welcome messages have been disabled'),
                    flags: 64
                } as any);
                return;
            }

            // - ENABLE SUBCOMMAND - \\
            if (subcommand === 'enable') {
                const settings = await update_welcome_enabled(interaction.guildId, true);

                if (!settings) {
                    await interaction.reply({
                        ...create_simple_message('❌ Welcome system is not configured yet. Use `/welcome setup` first.'),
                        flags: 64
                    } as any);
                    return;
                }

                await interaction.reply({
                    ...create_simple_message('✅ Welcome messages have been enabled'),
                    flags: 64
                } as any);
                return;
            }

            // - MESSAGE SUBCOMMAND - \\
            if (subcommand === 'message') {
                const custom_message = interaction.options.getString('text', true);

                const settings = await update_welcome_message(interaction.guildId, custom_message);

                if (!settings) {
                    await interaction.reply({
                        ...create_simple_message('❌ Welcome system is not configured yet. Use `/welcome setup` first.'),
                        flags: 64
                    } as any);
                    return;
                }

                await interaction.reply({
                    ...create_simple_message('✅ Custom welcome message has been set!\n\n**Preview:**\n' + custom_message),
                    flags: 64
                } as any);
                return;
            }

            // - TEST SUBCOMMAND - \\
            if (subcommand === 'test') {
                const settings = await get_welcome_settings(interaction.guildId);

                if (!settings) {
                    await interaction.reply({
                        ...create_simple_message('❌ Welcome system is not configured yet. Use `/welcome setup` first.'),
                        flags: 64
                    } as any);
                    return;
                }

                const channel = await interaction.guild?.channels.fetch(settings.channel_id) as TextChannel;
                
                if (!channel) {
                    await interaction.reply({
                        ...create_simple_message('❌ Welcome channel not found!'),
                        flags: 64
                    } as any);
                    return;
                }

                const member       = interaction.member;
                const avatar_url   = interaction.user.displayAvatarURL({ size: 256 });
                const server_name  = interaction.guild?.name || 'Server';
                
                let message_content = settings.custom_message || 
                    `## Welcome!\n<@${interaction.user.id}>, you've just joined ${server_name}.\nWe're glad to have you here.`;
                
                message_content = message_content
                    .replace('{user}', `<@${interaction.user.id}>`)
                    .replace('{server}', server_name)
                    .replace('{username}', interaction.user.username);

                const component_data = {
                    flags:      32768,
                    components: [
                        {
                            type:       17,
                            components: [
                                {
                                    type:       9,
                                    components: [
                                        {
                                            type:    10,
                                            content: message_content
                                        }
                                    ],
                                    accessory: {
                                        type:  11,
                                        media: {
                                            url: avatar_url
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                };

                await channel.send(component_data as any);

                await interaction.reply({
                    ...create_simple_message(`✅ Test welcome message sent to ${channel}`),
                    flags: 64
                } as any);
                return;
            }

            // - INFO SUBCOMMAND - \\
            if (subcommand === 'info') {
                const settings = await get_welcome_settings(interaction.guildId);

                if (!settings) {
                    await interaction.reply({
                        ...create_simple_message('❌ Welcome system is not configured yet. Use `/welcome setup` first.'),
                        flags: 64
                    } as any);
                    return;
                }

                const channel      = await interaction.guild?.channels.fetch(settings.channel_id);
                const status       = settings.enabled ? '✅ Enabled' : '❌ Disabled';
                const custom_msg   = settings.custom_message || 'Default message';

                const info_text = `## Welcome Settings\n\n**Status:** ${status}\n**Channel:** ${channel ? `<#${channel.id}>` : 'Not found'}\n**Custom Message:**\n${custom_msg}`;

                await interaction.reply({
                    ...create_simple_message(info_text),
                    flags: 64
                } as any);
                return;
            }

        } catch (error) {
            await log_error('Welcome Command Error', error as Error, {
                subcommand: subcommand,
                guild_id:   interaction.guildId,
                user:       interaction.user.tag
            });

            await interaction.reply({
                ...create_simple_message('❌ An error occurred while processing the command'),
                flags: 64
            } as any);
        }
    }
};

export default command;
