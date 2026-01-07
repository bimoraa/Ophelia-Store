/**
 * - POSTGRESQL DATABASE CONNECTION - \\
 */

import { Pool, PoolClient } from 'pg';
import { config } from '../config/environment';
import { log_error } from '../utils/error_logger';

let pool: Pool | null = null;

/**
 * @returns {Pool} PostgreSQL connection pool instance
 */
export const get_postgres_pool = (): Pool => {
    if (!pool) {
        pool = new Pool({
            connectionString: config.database_url,
            ssl:              {
                rejectUnauthorized: false
            }
        });

        pool.on('error', async (err) => {
            await log_error('PostgreSQL Pool Error', err);
        });

        console.log('[ - DATABASE - ] PostgreSQL pool created successfully');
    }
    
    return pool;
};

/**
 * @returns {Promise<PoolClient>} PostgreSQL client from pool
 */
export const get_postgres_client = async (): Promise<PoolClient> => {
    try {
        const client = await get_postgres_pool().connect();
        return client;
    } catch (error) {
        await log_error('PostgreSQL Client Connection Error', error as Error);
        throw error;
    }
};

/**
 * @returns {Promise<void>} Initialize PostgreSQL tables
 */
export const initialize_postgres_tables = async (): Promise<void> => {
    const client = await get_postgres_client();
    
    try {
        // - CREATE REMINDERS TABLE - \\
        await client.query(`
            CREATE TABLE IF NOT EXISTS reminders (
                id          SERIAL PRIMARY KEY,
                user_id     VARCHAR(255) NOT NULL,
                guild_id    VARCHAR(255) NOT NULL,
                channel_id  VARCHAR(255) NOT NULL,
                message     TEXT NOT NULL,
                remind_at   TIMESTAMP NOT NULL,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_sent     BOOLEAN DEFAULT FALSE
            );
        `);

        // - CREATE TICKETS TABLE - \\
        await client.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id          SERIAL PRIMARY KEY,
                ticket_id   VARCHAR(255) UNIQUE NOT NULL,
                user_id     VARCHAR(255) NOT NULL,
                guild_id    VARCHAR(255) NOT NULL,
                channel_id  VARCHAR(255) NOT NULL,
                subject     TEXT NOT NULL,
                status      VARCHAR(50) DEFAULT 'open',
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                closed_at   TIMESTAMP
            );
        `);

        // - CREATE AFK TABLE - \\
        await client.query(`
            CREATE TABLE IF NOT EXISTS afk_users (
                id          SERIAL PRIMARY KEY,
                user_id     VARCHAR(255) NOT NULL,
                guild_id    VARCHAR(255) NOT NULL,
                reason      TEXT,
                set_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, guild_id)
            );
        `);

        // - CREATE WELCOME SETTINGS TABLE - \\
        await client.query(`
            CREATE TABLE IF NOT EXISTS welcome_settings (
                id              SERIAL PRIMARY KEY,
                guild_id        VARCHAR(255) UNIQUE NOT NULL,
                channel_id      VARCHAR(255) NOT NULL,
                enabled         BOOLEAN DEFAULT TRUE,
                custom_message  TEXT,
                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // - CREATE SERVER STATS TABLE - \\
        await client.query(`
            CREATE TABLE IF NOT EXISTS server_stats (
                id          SERIAL PRIMARY KEY,
                guild_id    VARCHAR(255) NOT NULL,
                channel_id  VARCHAR(255) NOT NULL,
                stat_type   VARCHAR(50) NOT NULL,
                text_format TEXT NOT NULL,
                enabled     BOOLEAN DEFAULT TRUE,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(guild_id, channel_id)
            );
        `);

        console.log('[ - DATABASE - ] PostgreSQL tables initialized successfully');
    } catch (error) {
        await log_error('PostgreSQL Table Initialization Error', error as Error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * @returns {Promise<void>} Close PostgreSQL pool
 */
export const close_postgres_pool = async (): Promise<void> => {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('[ - DATABASE - ] PostgreSQL pool closed successfully');
    }
};
