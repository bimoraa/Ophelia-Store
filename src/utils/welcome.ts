/**
 * - WELCOME MESSAGE UTILITY - \\
 */

import { GuildMember } from 'discord.js';
import { create_component_v2 } from './message_component_v2';

interface WelcomeComponentData {
    flags:      number;
    components: any[];
}

/**
 * @param {GuildMember} member - Guild member who joined
 * @param {string} server_name - Server name
 * @returns {WelcomeComponentData} Welcome component v2 data
 */
export const create_welcome_component = (
    member:      GuildMember,
    server_name: string
): WelcomeComponentData => {
    const avatar_url = member.user.displayAvatarURL({ size: 256 });
    const content    = `## Welcome!\n<@${member.id}>, you've just joined ${server_name}.\nWe're glad to have you here.`;
    
    return create_component_v2()
        .add_container(container => {
            container.add_section(section => {
                section
                    .add_text(content)
                    .add_media(avatar_url);
            });
        })
        .build();
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
): WelcomeComponentData => {
    const avatar_url = member.user.displayAvatarURL({ size: 256 });
    const content    = custom_message
        .replace('{user}', `<@${member.id}>`)
        .replace('{server}', server_name)
        .replace('{username}', member.user.username);
    
    return create_component_v2()
        .add_container(container => {
            container.add_section(section => {
                section
                    .add_text(content)
                    .add_media(avatar_url);
            });
        })
        .build();
};
