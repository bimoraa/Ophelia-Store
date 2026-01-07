/**
 * - MONGODB DATABASE CONNECTION - \\
 */

import mongoose from 'mongoose';
import { config } from '../config/environment';
import { log_error } from '../utils/error_logger';

/**
 * @returns {Promise<void>} Connects to MongoDB database
 */
export const connect_mongodb = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongo_uri);
        console.log('[ - DATABASE - ] MongoDB connected successfully');
    } catch (error) {
        await log_error('MongoDB Connection Error', error as Error, {
            uri: config.mongo_uri.split('@')[1] || 'unknown'
        });
        throw error;
    }
};

/**
 * @returns {Promise<void>} Disconnects from MongoDB database
 */
export const disconnect_mongodb = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('[ - DATABASE - ] MongoDB disconnected successfully');
    } catch (error) {
        await log_error('MongoDB Disconnection Error', error as Error);
        throw error;
    }
};
