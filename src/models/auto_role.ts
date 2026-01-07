/**
 * - AUTO ROLE POSTGRESQL HELPERS - \\
 */

import { get_postgres_client } from '../database/postgres';
import { log_error } from '../utils/error_logger';

export interface AutoRole {
    id?:         number;
    guild_id:    string;
    role_id:     string;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * @param {string} guild_id - Guild ID
 * @returns {Promise<AutoRole | null>} Auto role config for guild
 */
export const get_auto_role = async (guild_id: string): Promise<AutoRole | null> => {
    const client = await get_postgres_client();

    try {
        const result = await client.query(
            'SELECT * FROM auto_roles WHERE guild_id = $1',
            [guild_id]
        );

        return result.rows[0] || null;
    } catch (error) {
        await log_error('Get Auto Role Error', error as Error, { guild_id });
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {AutoRole} data - Auto role data
 * @returns {Promise<AutoRole>} Upserted auto role record
 */
export const upsert_auto_role = async (data: AutoRole): Promise<AutoRole> => {
    const client = await get_postgres_client();

    try {
        const result = await client.query(
            `INSERT INTO auto_roles (guild_id, role_id, updated_at)
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (guild_id)
             DO UPDATE SET
                role_id    = EXCLUDED.role_id,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [data.guild_id, data.role_id]
        );

        return result.rows[0];
    } catch (error) {
        await log_error('Upsert Auto Role Error', error as Error, { guild_id: data.guild_id, role_id: data.role_id });
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {string} guild_id - Guild ID
 * @returns {Promise<void>} Remove auto role configuration
 */
export const delete_auto_role = async (guild_id: string): Promise<void> => {
    const client = await get_postgres_client();

    try {
        await client.query(
            'DELETE FROM auto_roles WHERE guild_id = $1',
            [guild_id]
        );
    } catch (error) {
        await log_error('Delete Auto Role Error', error as Error, { guild_id });
        throw error;
    } finally {
        client.release();
    }
};
