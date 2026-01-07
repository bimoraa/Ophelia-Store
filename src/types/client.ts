/**
 * - DISCORD CLIENT TYPES - \\
 */

import { Client, Collection, ClientOptions } from 'discord.js';
import { Command } from './command';

export interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
}

/**
 * @param {ClientOptions} options - Discord client options
 * @returns {ExtendedClient} Extended Discord client with commands collection
 */
export const create_client = (options: ClientOptions): ExtendedClient => {
    const client           = new Client(options) as ExtendedClient;
    client.commands = new Collection<string, Command>();
    return client;
};
