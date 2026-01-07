/**
 * - WELCOME SETTINGS SCHEMA - \\
 */

import mongoose, { Schema, Document } from 'mongoose';

interface IWelcomeSettings extends Document {
    guild_id:        string;
    channel_id:      string;
    enabled:         boolean;
    custom_message?: string;
    created_at:      Date;
    updated_at:      Date;
}

const welcome_settings_schema = new Schema<IWelcomeSettings>({
    guild_id:        {
        type:     String,
        required: true,
        unique:   true
    },
    channel_id:      {
        type:     String,
        required: true
    },
    enabled:         {
        type:    Boolean,
        default: true
    },
    custom_message:  {
        type:     String,
        required: false
    },
    created_at:      {
        type:    Date,
        default: Date.now
    },
    updated_at:      {
        type:    Date,
        default: Date.now
    }
});

export const WelcomeSettings = mongoose.model<IWelcomeSettings>('WelcomeSettings', welcome_settings_schema);
