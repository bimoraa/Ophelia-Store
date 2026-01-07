/**
 * - COMMAND DEPLOYER - \\
 */

import { REST, Routes } from 'discord.js';
import { ExtendedClient } from '../types/client';
import { config } from '../config/environment';
import { log_error } from '../utils/error_logger';

/**
 * @param {ExtendedClient} client - Extended Discord client
 * @returns {Promise<void>} Deploys commands to Discord API
 */
export const deploy_commands = async (client: ExtendedClient): Promise<void> => {
    try {
        const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());

        console.log(`[ - DEPLOY - ] Started refreshing ${commands.length} application (/) commands.`);

        const rest = new REST().setToken(config.discord_token);

        const data = await rest.put(
            Routes.applicationCommands(config.client_id),
            { body: commands }
        ) as any[];

        console.log(`[ - DEPLOY - ] Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        await log_error('Command Deployment Error', error as Error);
        throw error;
    }
};
