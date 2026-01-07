/**
 * - SERVER STATS UPDATER UTILITY - \\
 */

import { Collection, Guild, GuildMember, VoiceChannel } from 'discord.js';
import { get_all_server_stats, ServerStat } from '../models/server_stats';
import { log_error } from './error_logger';

/**
 * @param {Guild} guild - Discord guild
 * @param {ServerStat} stat - Server stat configuration
 * @param {Collection<string, GuildMember> | undefined} member_entries - Optional fetched members
 * @returns {number} Count based on stat type
 */
const get_count_by_type = (
    guild:           Guild,
    stat:            ServerStat,
    member_entries?: Collection<string, GuildMember>
): number => {
    switch (stat.stat_type) {
        case 'ALL_MEMBERS':
            return guild.memberCount ?? guild.approximateMemberCount ?? 0;
        
        case 'MEMBERS':
            if (member_entries) {
                return member_entries.filter(m => !m.user.bot).size;
            }
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
        
        if (stats.length === 0) {
            return;
        }

        const refreshed_guild = await guild.fetch();
        
        let member_entries: Collection<string, GuildMember> | undefined;
        
        if (stats.some(stat => stat.stat_type === 'MEMBERS')) {
            try {
                member_entries = await refreshed_guild.members.fetch();
            } catch (member_fetch_error) {
                await log_error('Fetch Guild Members For Stats Error', member_fetch_error as Error, {
                    guild_id: guild.id
                });
            }
        }
        
        for (const stat of stats) {
            try {
                const channel = await refreshed_guild.channels.fetch(stat.channel_id);
                
                if (!channel || !(channel instanceof VoiceChannel)) {
                    console.log(`[ - STATS - ] Channel ${stat.channel_id} not found or not voice channel`);
                    continue;
                }
                
                const count    = get_count_by_type(refreshed_guild, stat, member_entries);
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
