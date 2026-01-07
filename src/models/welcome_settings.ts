/**
 * - WELCOME SETTINGS POSTGRESQL HELPERS - \\
 */

import { get_postgres_client } from '../database/postgres';
import { log_error } from '../utils/error_logger';

export interface WelcomeSettings {
    id?:             number;
    guild_id:        string;
    channel_id:      string;
    enabled:         boolean;
    custom_message?: string;
    created_at?:     Date;
    updated_at?:     Date;
}

/**
 * @param {string} guild_id - Guild ID
 * @returns {Promise<WelcomeSettings | null>} Welcome settings for guild
 */
export const get_welcome_settings = async (guild_id: string): Promise<WelcomeSettings | null> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            'SELECT * FROM welcome_settings WHERE guild_id = $1',
            [guild_id]
        );
        
        return result.rows[0] || null;
    } catch (error) {
        await log_error('Get Welcome Settings Error', error as Error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {WelcomeSettings} settings - Welcome settings to upsert
 * @returns {Promise<WelcomeSettings>} Upserted welcome settings
 */
export const upsert_welcome_settings = async (settings: WelcomeSettings): Promise<WelcomeSettings> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            `INSERT INTO welcome_settings (guild_id, channel_id, enabled, custom_message, updated_at)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             ON CONFLICT (guild_id) 
             DO UPDATE SET 
                channel_id = $2,
                enabled = $3,
                custom_message = $4,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [settings.guild_id, settings.channel_id, settings.enabled, settings.custom_message || null]
        );
        
        return result.rows[0];
    } catch (error) {
        await log_error('Upsert Welcome Settings Error', error as Error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {string} guild_id - Guild ID
 * @param {boolean} enabled - Enabled status
 * @returns {Promise<WelcomeSettings | null>} Updated welcome settings
 */
export const update_welcome_enabled = async (guild_id: string, enabled: boolean): Promise<WelcomeSettings | null> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            `UPDATE welcome_settings 
             SET enabled = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE guild_id = $2 
             RETURNING *`,
            [enabled, guild_id]
        );
        
        return result.rows[0] || null;
    } catch (error) {
        await log_error('Update Welcome Enabled Error', error as Error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @param {string} guild_id - Guild ID
 * @param {string} message - Custom message
 * @returns {Promise<WelcomeSettings | null>} Updated welcome settings
 */
export const update_welcome_message = async (guild_id: string, message: string): Promise<WelcomeSettings | null> => {
    const client = await get_postgres_client();
    
    try {
        const result = await client.query(
            `UPDATE welcome_settings 
             SET custom_message = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE guild_id = $2 
             RETURNING *`,
            [message, guild_id]
        );
        
        return result.rows[0] || null;
    } catch (error) {
        await log_error('Update Welcome Message Error', error as Error);
        throw error;
    } finally {
        client.release();
    }
};
