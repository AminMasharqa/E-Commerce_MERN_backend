import mongoose from 'mongoose';
export const connectDatabase = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('ERROR: MONGODB_URI is not defined in environment variables');
        console.error('Current env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
        throw new Error('MONGODB_URI environment variable is required');
    }
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Using URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
        await mongoose.connect(MONGODB_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
        });
        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB');
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
export const disconnectDatabase = async () => {
    try {
        await mongoose.connection.close();
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
};
export default { connectDatabase, disconnectDatabase };
//# sourceMappingURL=database.js.map