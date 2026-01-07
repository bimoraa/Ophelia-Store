/**
 * - GUILD MEMBER ADD EVENT HANDLER - \\
 */

import { Client, Events, GuildMember, TextChannel } from 'discord.js';
import { get_welcome_settings } from '../models/welcome_settings';
import { get_auto_role } from '../models/auto_role';
import { create_welcome_component, create_custom_welcome_component } from '../utils/welcome';
import { log_error } from '../utils/error_logger';

/**
 * @param {Client} client - Discord client instance
 * @returns {void} Registers guild member add event handler
 */
export const register_guild_member_add_event = (client: Client): void => {
    client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
        try {
            console.log(`[ - MEMBER JOIN - ] ${member.user.tag} joined ${member.guild.name}`);

            const auto_role = await get_auto_role(member.guild.id);

            if (auto_role) {
                const role = await member.guild.roles.fetch(auto_role.role_id);

                if (role && role.editable) {
                    if (!member.roles.cache.has(role.id)) {
                        await member.roles.add(role, 'Auto role assignment');
                        console.log(`[ - AUTO ROLE - ] Assigned ${role.name} to ${member.user.tag} in ${member.guild.name}`);
                    }
                } else {
                    await log_error('Auto Role Missing/Unassignable', new Error('Role unavailable or not editable'), {
                        guild_id: member.guild.id,
                        role_id:  auto_role.role_id
                    });
                }
            }

            // - GET WELCOME SETTINGS - \\
            const welcome_settings = await get_welcome_settings(member.guild.id);

            if (!welcome_settings || !welcome_settings.enabled) {
                console.log(`[ - WELCOME - ] Welcome disabled for ${member.guild.name}`);
                return;
            }

            // - GET WELCOME CHANNEL - \\
            const channel = await member.guild.channels.fetch(welcome_settings.channel_id);

            if (!channel || !channel.isTextBased()) {
                console.log(`[ - WELCOME - ] Welcome channel not found for ${member.guild.name}`);
                return;
            }

            const text_channel = channel as TextChannel;

            // - CREATE WELCOME MESSAGE - \\
            let component_data;
            
            if (welcome_settings.custom_message) {
                component_data = create_custom_welcome_component(
                    member,
                    member.guild.name,
                    welcome_settings.custom_message
                );
            } else {
                component_data = create_welcome_component(
                    member,
                    member.guild.name
                );
            }

            // - SEND WELCOME MESSAGE - \\
            await text_channel.send(component_data as any);

            console.log(`[ - WELCOME - ] Sent welcome message for ${member.user.tag} in ${member.guild.name}`);

        } catch (error) {
            await log_error('Guild Member Add Event Error', error as Error, {
                guild_id: member.guild.id,
                user_id:  member.id,
                username: member.user.tag
            });
        }
    });
};
