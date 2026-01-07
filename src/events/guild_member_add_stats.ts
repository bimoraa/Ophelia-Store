/**
 * - GUILD MEMBER ADD EVENT - \\
 */

import { Client, Events, GuildMember } from 'discord.js';
import { update_all_server_stats } from '../utils/server_stats_updater';
import { log_error } from '../utils/error_logger';

export default {
    name: Events.GuildMemberAdd,
    /**
     * @param {Client} client - Discord client
     * @param {GuildMember} member - Member who joined
     * @returns {Promise<void>} Handles member join event
     */
    async execute(client: Client, member: GuildMember): Promise<void> {
        try {
            await update_all_server_stats(member.guild);
        } catch (error) {
            await log_error('Guild Member Add Stats Update Error', error as Error, {
                guild_id: member.guild.id,
                user_id:  member.id
            });
        }
    }
};
