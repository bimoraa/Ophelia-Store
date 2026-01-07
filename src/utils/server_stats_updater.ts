/**
 * - SERVER STATS UPDATER UTILITY - \\
 */

import { Guild, VoiceChannel } from 'discord.js';
import { get_all_server_stats, ServerStat } from '../models/server_stats';
import { log_error } from './error_logger';

/**
 * @param {Guild} guild - Discord guild
 * @param {ServerStat} stat - Server stat configuration
 * @returns {number} Count based on stat type
 */
const get_count_by_type = (guild: Guild, stat: ServerStat): number => {
    switch (stat.stat_type) {
        case 'ALL_MEMBERS':
            return guild.memberCount;
        
        case 'MEMBERS':
            return guild.members.cache.filter(m => !m.user.bot).size;
        
        case 'SERVER_BOOST':
            return guild.premiumSubscriptionCount || 0;
        
        default:
            return 0;
    }
};

/**
 * @param {Guild} guild - Discord guild
 * @returns {Promise<void>} Updates all server stats for guild
 */
export const update_all_server_stats = async (guild: Guild): Promise<void> => {
    try {
        const stats = await get_all_server_stats(guild.id);
        
        for (const stat of stats) {
            try {
                const channel = await guild.channels.fetch(stat.channel_id);
                
                if (!channel || !(channel instanceof VoiceChannel)) {
                    console.log(`[ - STATS - ] Channel ${stat.channel_id} not found or not voice channel`);
                    continue;
                }
                
                const count    = get_count_by_type(guild, stat);
                const new_name = stat.text_format.replace('{COUNT}', count.toString());
                
                if (channel.name !== new_name) {
                    await channel.setName(new_name);
                    console.log(`[ - STATS - ] Updated ${stat.stat_type}: ${new_name}`);
                }
            } catch (error) {
                await log_error('Update Single Server Stat Error', error as Error, {
                    guild_id:   guild.id,
                    channel_id: stat.channel_id,
                    stat_type:  stat.stat_type
                });
            }
        }
    } catch (error) {
        await log_error('Update All Server Stats Error', error as Error, { guild_id: guild.id });
    }
};
