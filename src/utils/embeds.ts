/**
 * - EMBED BUILDER UTILITY - \\
 */

import { EmbedBuilder, ColorResolvable } from 'discord.js';

interface EmbedConfig {
    title?:       string;
    description?: string;
    color?:       ColorResolvable;
    thumbnail?:   string;
    image?:       string;
    footer?:      string;
    author?:      {
        name:     string;
        icon_url?: string;
    };
    fields?:      Array<{
        name:   string;
        value:  string;
        inline?: boolean;
    }>;
}

/**
 * @param {EmbedConfig} config - Embed configuration
 * @returns {EmbedBuilder} Configured Discord embed
 */
export const create_embed = (config: EmbedConfig): EmbedBuilder => {
    const embed = new EmbedBuilder();

    if (config.title) {
        embed.setTitle(config.title);
    }

    if (config.description) {
        embed.setDescription(config.description);
    }

    if (config.color) {
        embed.setColor(config.color);
    } else {
        embed.setColor(0x5865F2);
    }

    if (config.thumbnail) {
        embed.setThumbnail(config.thumbnail);
    }

    if (config.image) {
        embed.setImage(config.image);
    }

    if (config.footer) {
        embed.setFooter({ text: config.footer });
    } else {
        embed.setFooter({ text: 'Ophelia Store Bot' });
    }

    if (config.author) {
        embed.setAuthor({
            name:    config.author.name,
            iconURL: config.author.icon_url
        });
    }

    if (config.fields && config.fields.length > 0) {
        embed.addFields(config.fields);
    }

    embed.setTimestamp();

    return embed;
};

/**
 * @param {string} message - Success message
 * @returns {EmbedBuilder} Success embed
 */
export const create_success_embed = (message: string): EmbedBuilder => {
    return create_embed({
        description: message,
        color:       0x00FF00
    });
};

/**
 * @param {string} message - Error message
 * @returns {EmbedBuilder} Error embed
 */
export const create_error_embed_simple = (message: string): EmbedBuilder => {
    return create_embed({
        title:       'Error',
        description: message,
        color:       0xFF0000
    });
};

/**
 * @param {string} message - Info message
 * @returns {EmbedBuilder} Info embed
 */
export const create_info_embed = (message: string): EmbedBuilder => {
    return create_embed({
        description: message,
        color:       0x5865F2
    });
};
