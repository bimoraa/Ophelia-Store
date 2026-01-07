/**
 * - COMMAND LOADER - \\
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { ExtendedClient } from '../types/client';
import { Command } from '../types/command';
import { log_error } from '../utils/error_logger';

/**
 * @param {ExtendedClient} client - Extended Discord client
 * @param {string} commands_path - Path to commands directory
 * @returns {Promise<void>} Loads all commands from directory
 */
export const load_commands = async (
    client:        ExtendedClient,
    commands_path: string
): Promise<void> => {
    try {
        const load_commands_recursive = async (directory: string): Promise<void> => {
            const files = readdirSync(directory);

            for (const file of files) {
                const file_path = join(directory, file);
                const stat      = statSync(file_path);

                if (stat.isDirectory()) {
                    await load_commands_recursive(file_path);
                } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                    try {
                        const command: Command = require(file_path).default;

                        if ('data' in command && 'execute' in command) {
                            client.commands.set(command.data.name, command);
                            console.log(`[ - COMMAND - ] Loaded: ${command.data.name}`);
                        } else {
                            console.warn(`[ - WARNING - ] Command at ${file_path} is missing required "data" or "execute" property.`);
                        }
                    } catch (error) {
                        await log_error('Command Load Error', error as Error, {
                            file: file_path
                        });
                    }
                }
            }
        };

        await load_commands_recursive(commands_path);
        console.log(`[ - COMMAND - ] Total commands loaded: ${client.commands.size}`);
    } catch (error) {
        await log_error('Commands Directory Load Error', error as Error, {
            path: commands_path
        });
        throw error;
    }
};
