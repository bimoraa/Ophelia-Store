/**
 * - ERROR LOGGER UTILITY - \\
 */

import { EmbedBuilder } from 'discord.js';

interface ErrorContext {
    [key: string]: any;
}

/**
 * @param {string} error_title - Title of the error
 * @param {Error} error - Error object
 * @param {ErrorContext} context - Additional context information
 * @returns {Promise<void>} Logs error to console
 */
export const log_error = async (
    error_title: string,
    error:       Error,
    context?:    ErrorContext
): Promise<void> => {
    const timestamp  = new Date().toISOString();
    const error_data = {
        title:     error_title,
        message:   error.message,
        stack:     error.stack,
        context:   context || {},
        timestamp: timestamp
    };

    console.error('[ - ERROR - ]', error_title);
    console.error('Message:', error.message);
    if (error.stack) {
        console.error('Stack:', error.stack);
    }
    if (context) {
        console.error('Context:', JSON.stringify(context, null, 2));
    }
    console.error('Timestamp:', timestamp);
};

/**
 * @param {string} error_title - Title of the error
 * @param {Error} error - Error object
 * @param {ErrorContext} context - Additional context information
 * @returns {EmbedBuilder} Discord embed for error display
 */
export const create_error_embed = (
    error_title: string,
    error:       Error,
    context?:    ErrorContext
): EmbedBuilder => {
    const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(`Error: ${error_title}`)
        .setDescription(error.message)
        .setTimestamp()
        .setFooter({ text: 'Ophelia Store Bot' });

    if (context) {
        const context_fields = Object.entries(context).map(([key, value]) => ({
            name:   key,
            value:  String(value),
            inline: true
        }));
        embed.addFields(context_fields);
    }

    return embed;
};
