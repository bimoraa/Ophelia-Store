/**
 * - WELCOME MESSAGE UTILITY - \\
 */

import { GuildMember } from 'discord.js';
import { build_component_reply, message_payload } from './message_component_v2';

/**
 * @param {GuildMember} member - Guild member who joined
 * @param {string} server_name - Server name
 * @returns {WelcomeComponentData} Welcome component v2 data
 */
export const create_welcome_component = (
    member:      GuildMember,
    server_name: string
): message_payload => {
    const avatar_url = member.user.displayAvatarURL({ size: 256 });
    const content    = `## Welcome!\n<@${member.id}>, you've just joined ${server_name}.\nWe're glad to have you here.`;

    return build_component_reply(content, avatar_url);
};

/**
 * @param {GuildMember} member - Guild member who joined
 * @param {string} server_name - Server name
 * @param {string} custom_message - Custom welcome message
 * @returns {WelcomeComponentData} Custom welcome component v2 data
 */
export const create_custom_welcome_component = (
    member:         GuildMember,
    server_name:    string,
    custom_message: string
): message_payload => {
    const avatar_url = member.user.displayAvatarURL({ size: 256 });
    const content    = custom_message
        .replace('{user}', `<@${member.id}>`)
        .replace('{server}', server_name)
        .replace('{username}', member.user.username);

    return build_component_reply(content, avatar_url);
};
