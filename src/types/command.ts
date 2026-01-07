/**
 * - COMMAND INTERFACE - \\
 */

import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder,
    AutocompleteInteraction 
} from 'discord.js';

export interface Command {
    data:         SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
    execute:      (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}
