/**
 * - OPHELIA STORE BOT MAIN FILE - \\
 */

import { GatewayIntentBits } from 'discord.js';
import { join } from 'path';
import { config, validate_config } from './config/environment';
import { create_client } from './types/client';
import { connect_mongodb } from './database/mongodb';
import { initialize_postgres_tables } from './database/postgres';
import { register_ready_event } from './events/ready';
import { register_interaction_event } from './events/interaction_create';
import { register_guild_member_add_event } from './events/guild_member_add';
import { load_commands } from './handlers/command_loader';
import { deploy_commands } from './handlers/command_deployer';
import { log_error } from './utils/error_logger';

/**
 * @returns {Promise<void>} Main bot initialization function
 */
const main = async (): Promise<void> => {
    try {
        console.log('[ - INIT - ] Starting Ophelia Store Bot...');

        // - VALIDATE CONFIGURATION - \\
        if (!validate_config()) {
            throw new Error('Invalid configuration. Please check your .env file.');
        }

        // - CREATE CLIENT - \\
        const client = create_client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences
            ]
        });

        // - CONNECT TO DATABASES - \\
        console.log('[ - INIT - ] Connecting to databases...');
        await connect_mongodb();
        await initialize_postgres_tables();

        // - LOAD COMMANDS - \\
        console.log('[ - INIT - ] Loading commands...');
        const commands_path = join(__dirname, 'commands');
        await load_commands(client, commands_path);

        // - DEPLOY COMMANDS - \\
        console.log('[ - INIT - ] Deploying commands to Discord...');
        await deploy_commands(client);

        // - REGISTER EVENTS - \\
        console.log('[ - INIT - ] Registering event handlers...');
        register_ready_event(client);
        register_interaction_event(client);
        register_guild_member_add_event(client);

        // - LOGIN TO DISCORD - \\
        console.log('[ - INIT - ] Logging in to Discord...');
        await client.login(config.discord_token);

    } catch (error) {
        await log_error('Bot Initialization Error', error as Error);
        process.exit(1);
    }
};

// - HANDLE PROCESS EVENTS - \\
process.on('unhandledRejection', async (error: Error) => {
    await log_error('Unhandled Promise Rejection', error);
});

process.on('uncaughtException', async (error: Error) => {
    await log_error('Uncaught Exception', error);
    process.exit(1);
});

// - START BOT - \\
main();
