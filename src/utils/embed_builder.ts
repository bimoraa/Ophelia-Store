/**
 * - EMBED BUILDER UTILITY - \\
 */

import { EmbedBuilder, ColorResolvable } from 'discord.js';

/**
 * @param {string} description - Embed description text
 * @param {ColorResolvable} color - Embed color (default: dark theme)
 * @returns {EmbedBuilder} Discord embed
 */
export function create_simple_embed(description: string, color: ColorResolvable = 0x2b2d31): EmbedBuilder {
    return new EmbedBuilder()
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

/**
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @param {ColorResolvable} color - Embed color
 * @returns {EmbedBuilder} Discord embed with title
 */
export function create_embed(title: string, description: string, color: ColorResolvable = 0x2b2d31): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}
