/**
 * - ENVIRONMENT CONFIGURATION - \\
 */

import dotenv from 'dotenv';

dotenv.config();

interface Config {
    discord_token: string;
    client_id:     string;
    database_url:  string;
    web_url:       string;
}

/**
 * @returns {Config} Environment configuration object
 */
export const config: Config = {
    discord_token: process.env.DISCORD_TOKEN || '',
    client_id:     process.env.CLIENT_ID || '',
    database_url:  process.env.DATABASE_URL || '',
    web_url:       process.env.WEB_URL || ''
};

/**
 * @returns {boolean} True if all required environment variables are set
 */
export const validate_config = (): boolean => {
    const required_vars = ['discord_token', 'client_id', 'database_url'];
    
    for (const key of required_vars) {
        if (!config[key as keyof Config]) {
            console.error(`[ - ERROR - ] Missing required environment variable: ${key.toUpperCase()}`);
            return false;
        }
    }
    
    return true;
};
