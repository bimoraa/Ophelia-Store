/**
 * - READY EVENT HANDLER - \\
 */

import { Client, Events } from 'discord.js';

/**
 * @param {Client} client - Discord client instance
 * @returns {void} Registers ready event handler
 */
export const register_ready_event = (client: Client): void => {
    client.once(Events.ClientReady, async (ready_client) => {
        console.log('[ - BOT - ] Ready!');
        console.log(`[ - BOT - ] Logged in as ${ready_client.user.tag}`);
        console.log(`[ - BOT - ] Serving ${ready_client.guilds.cache.size} guilds`);
        
        ready_client.user.setPresence({
            activities: [{
                name: 'Ophelia Store',
                type: 0
            }],
            status: 'online'
        });
    });
};
