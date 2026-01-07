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
import { WelcomeSettings } from '../../../models/welcome_settings';
import { create_success_embed, create_error_embed_simple, create_info_embed } from '../../../utils/embeds';
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
                embeds:    [create_error_embed_simple('This command can only be used in a server!')],
                ephemeral: true
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        try {
            // - SETUP SUBCOMMAND - \\
            if (subcommand === 'setup') {
                const channel = interaction.options.getChannel('channel', true) as TextChannel;

                await WelcomeSettings.findOneAndUpdate(
                    { guild_id: interaction.guildId },
                    {
                        guild_id:   interaction.guildId,
                        channel_id: channel.id,
                        enabled:    true,
                        updated_at: new Date()
                    },
                    { upsert: true, new: true }
                );

                await interaction.reply({
                    embeds:    [create_success_embed(`Welcome messages will be sent to ${channel}`)],
                    ephemeral: true
                });
                return;
            }

            // - DISABLE SUBCOMMAND - \\
            if (subcommand === 'disable') {
                const settings = await WelcomeSettings.findOneAndUpdate(
                    { guild_id: interaction.guildId },
                    { enabled: false, updated_at: new Date() },
                    { new: true }
                );

                if (!settings) {
                    await interaction.reply({
                        embeds:    [create_error_embed_simple('Welcome system is not configured yet. Use `/welcome setup` first.')],
                        ephemeral: true
                    });
                    return;
                }

                await interaction.reply({
                    embeds:    [create_success_embed('Welcome messages have been disabled')],
                    ephemeral: true
                });
                return;
            }

            // - ENABLE SUBCOMMAND - \\
            if (subcommand === 'enable') {
                const settings = await WelcomeSettings.findOneAndUpdate(
                    { guild_id: interaction.guildId },
                    { enabled: true, updated_at: new Date() },
                    { new: true }
                );

                if (!settings) {
                    await interaction.reply({
                        embeds:    [create_error_embed_simple('Welcome system is not configured yet. Use `/welcome setup` first.')],
                        ephemeral: true
                    });
                    return;
                }

                await interaction.reply({
                    embeds:    [create_success_embed('Welcome messages have been enabled')],
                    ephemeral: true
                });
                return;
            }

            // - MESSAGE SUBCOMMAND - \\
            if (subcommand === 'message') {
                const custom_message = interaction.options.getString('text', true);

                const settings = await WelcomeSettings.findOneAndUpdate(
                    { guild_id: interaction.guildId },
                    { custom_message: custom_message, updated_at: new Date() },
                    { new: true }
                );

                if (!settings) {
                    await interaction.reply({
                        embeds:    [create_error_embed_simple('Welcome system is not configured yet. Use `/welcome setup` first.')],
                        ephemeral: true
                    });
                    return;
                }

                await interaction.reply({
                    embeds:    [create_success_embed('Custom welcome message has been set!\n\nPreview:\n' + custom_message)],
                    ephemeral: true
                });
                return;
            }

            // - TEST SUBCOMMAND - \\
            if (subcommand === 'test') {
                const settings = await WelcomeSettings.findOne({ guild_id: interaction.guildId });

                if (!settings) {
                    await interaction.reply({
                        embeds:    [create_error_embed_simple('Welcome system is not configured yet. Use `/welcome setup` first.')],
                        ephemeral: true
                    });
                    return;
                }

                const channel = await interaction.guild?.channels.fetch(settings.channel_id) as TextChannel;
                
                if (!channel) {
                    await interaction.reply({
                        embeds:    [create_error_embed_simple('Welcome channel not found!')],
                        ephemeral: true
                    });
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
                    embeds:    [create_success_embed(`Test welcome message sent to ${channel}`)],
                    ephemeral: true
                });
                return;
            }

            // - INFO SUBCOMMAND - \\
            if (subcommand === 'info') {
                const settings = await WelcomeSettings.findOne({ guild_id: interaction.guildId });

                if (!settings) {
                    await interaction.reply({
                        embeds:    [create_error_embed_simple('Welcome system is not configured yet. Use `/welcome setup` first.')],
                        ephemeral: true
                    });
                    return;
                }

                const channel      = await interaction.guild?.channels.fetch(settings.channel_id);
                const status       = settings.enabled ? 'Enabled' : 'Disabled';
                const custom_msg   = settings.custom_message || 'Default message';

                const info_embed = create_info_embed('');
                info_embed.setTitle('Welcome Settings');
                info_embed.addFields([
                    { name: 'Status', value: status, inline: true },
                    { name: 'Channel', value: channel ? `<#${channel.id}>` : 'Not found', inline: true },
                    { name: 'Custom Message', value: custom_msg, inline: false }
                ]);

                await interaction.reply({
                    embeds:    [info_embed],
                    ephemeral: true
                });
                return;
            }

        } catch (error) {
            await log_error('Welcome Command Error', error as Error, {
                subcommand: subcommand,
                guild_id:   interaction.guildId,
                user:       interaction.user.tag
            });

            await interaction.reply({
                embeds:    [create_error_embed_simple('An error occurred while processing the command')],
                ephemeral: true
            });
        }
    }
};

export default command;
