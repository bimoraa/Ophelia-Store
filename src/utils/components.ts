/**
 * - DISCORD COMPONENTS V2 UTILITY - \\
 */

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType
} from 'discord.js';

interface ButtonConfig {
    custom_id: string;
    label:     string;
    style:     ButtonStyle;
    emoji?:    string;
    disabled?: boolean;
    url?:      string;
}

interface SelectMenuOption {
    label:       string;
    value:       string;
    description?: string;
    emoji?:      string;
}

interface SelectMenuConfig {
    custom_id:   string;
    placeholder: string;
    options:     SelectMenuOption[];
    min_values?: number;
    max_values?: number;
}

/**
 * @param {ButtonConfig[]} buttons - Array of button configurations
 * @returns {ActionRowBuilder<ButtonBuilder>} Action row with buttons
 */
export const create_button_row = (
    buttons: ButtonConfig[]
): ActionRowBuilder<ButtonBuilder> => {
    const row = new ActionRowBuilder<ButtonBuilder>();

    for (const button_config of buttons) {
        const button = new ButtonBuilder()
            .setCustomId(button_config.custom_id)
            .setLabel(button_config.label)
            .setStyle(button_config.style);

        if (button_config.emoji) {
            button.setEmoji(button_config.emoji);
        }

        if (button_config.disabled !== undefined) {
            button.setDisabled(button_config.disabled);
        }

        if (button_config.url) {
            button.setURL(button_config.url);
        }

        row.addComponents(button);
    }

    return row;
};

/**
 * @param {SelectMenuConfig} config - Select menu configuration
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} Action row with select menu
 */
export const create_select_menu_row = (
    config: SelectMenuConfig
): ActionRowBuilder<StringSelectMenuBuilder> => {
    const options = config.options.map(opt => {
        const option = new StringSelectMenuOptionBuilder()
            .setLabel(opt.label)
            .setValue(opt.value);

        if (opt.description) {
            option.setDescription(opt.description);
        }

        if (opt.emoji) {
            option.setEmoji(opt.emoji);
        }

        return option;
    });

    const select_menu = new StringSelectMenuBuilder()
        .setCustomId(config.custom_id)
        .setPlaceholder(config.placeholder)
        .addOptions(options);

    if (config.min_values !== undefined) {
        select_menu.setMinValues(config.min_values);
    }

    if (config.max_values !== undefined) {
        select_menu.setMaxValues(config.max_values);
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(select_menu);

    return row;
};

/**
 * @param {string} custom_id - Custom ID for the button
 * @param {string} label - Button label
 * @param {ButtonStyle} style - Button style
 * @returns {ActionRowBuilder<ButtonBuilder>} Single button action row
 */
export const create_single_button = (
    custom_id: string,
    label:     string,
    style:     ButtonStyle = ButtonStyle.Primary
): ActionRowBuilder<ButtonBuilder> => {
    return create_button_row([{ custom_id, label, style }]);
};
