/**
 * - GUILD UPDATE EVENT - \\
 */

import { Client, Events, Guild } from 'discord.js';
import { update_all_server_stats } from '../utils/server_stats_updater';
import { log_error } from '../utils/error_logger';

export default {
    name: Events.GuildUpdate,
    /**
     * @param {Client} client - Discord client
     * @param {Guild} old_guild - Old guild state
     * @param {Guild} new_guild - New guild state
     * @returns {Promise<void>} Handles guild update event
     */
    async execute(client: Client, old_guild: Guild, new_guild: Guild): Promise<void> {
        try {
            if (old_guild.premiumSubscriptionCount !== new_guild.premiumSubscriptionCount) {
                await update_all_server_stats(new_guild);
            }
        } catch (error) {
            await log_error('Guild Update Stats Update Error', error as Error, {
                guild_id: new_guild.id
            });
        }
    }
};
