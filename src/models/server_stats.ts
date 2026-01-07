/**
 * - SERVER STATS MODEL - \\
 */

import { get_postgres_client } from '../database/postgres';
import { log_error } from '../utils/error_logger';

export interface ServerStat {
    id:          number;
    guild_id:    string;
    channel_id:  string;
    stat_type:   'ALL_MEMBERS' | 'MEMBERS' | 'SERVER_BOOST';
    text_format: string;
    enabled:     boolean;
    created_at:  Date;
    updated_at:  Date;
}

/**
 * @param {string} guild_id - Guild ID
 * @returns {Promise<ServerStat[]>} All server stats for guild
 */
export const get_all_server_stats = async (guild_id: string): Promise<ServerStat[]> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            'SELECT * FROM server_stats WHERE guild_id = $1 AND enabled = true',
            [guild_id]
        );
        return result.rows;
    } catch (error) {
        await log_error('Get All Server Stats Error', error as Error, { guild_id });
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {string} guild_id - Guild ID
 * @param {string} channel_id - Channel ID
 * @returns {Promise<ServerStat | null>} Server stat or null
 */
export const get_server_stat = async (guild_id: string, channel_id: string): Promise<ServerStat | null> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            'SELECT * FROM server_stats WHERE guild_id = $1 AND channel_id = $2',
            [guild_id, channel_id]
        );
        return result.rows[0] || null;
    } catch (error) {
        await log_error('Get Server Stat Error', error as Error, { guild_id, channel_id });
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {Partial<ServerStat>} stat_data - Server stat data
 * @returns {Promise<ServerStat>} Created/updated server stat
 */
export const upsert_server_stat = async (stat_data: Partial<ServerStat>): Promise<ServerStat> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            `INSERT INTO server_stats (guild_id, channel_id, stat_type, text_format, enabled)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (guild_id, channel_id)
             DO UPDATE SET
                stat_type   = EXCLUDED.stat_type,
                text_format = EXCLUDED.text_format,
                enabled     = EXCLUDED.enabled,
                updated_at  = CURRENT_TIMESTAMP
             RETURNING *`,
            [stat_data.guild_id, stat_data.channel_id, stat_data.stat_type, stat_data.text_format, stat_data.enabled ?? true]
        );
        return result.rows[0];
    } catch (error) {
        await log_error('Upsert Server Stat Error', error as Error, stat_data);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {string} guild_id - Guild ID
 * @param {string} channel_id - Channel ID
 * @returns {Promise<boolean>} Success status
 */
export const delete_server_stat = async (guild_id: string, channel_id: string): Promise<boolean> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            'DELETE FROM server_stats WHERE guild_id = $1 AND channel_id = $2',
            [guild_id, channel_id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
        await log_error('Delete Server Stat Error', error as Error, { guild_id, channel_id });
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {string} guild_id - Guild ID
 * @param {string} channel_id - Channel ID
 * @param {boolean} enabled - Enabled status
 * @returns {Promise<ServerStat | null>} Updated server stat or null
 */
export const update_server_stat_enabled = async (
    guild_id:    string,
    channel_id:  string,
    enabled:     boolean
): Promise<ServerStat | null> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            `UPDATE server_stats 
             SET enabled = $3, updated_at = CURRENT_TIMESTAMP
             WHERE guild_id = $1 AND channel_id = $2
             RETURNING *`,
            [guild_id, channel_id, enabled]
        );
        return result.rows[0] || null;
    } catch (error) {
        await log_error('Update Server Stat Enabled Error', error as Error, { guild_id, channel_id, enabled });
        throw error;
    } finally {
        client.release();
    }
};
