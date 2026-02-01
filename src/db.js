import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true }, // e.g., 'admin' or email
    youtubeTokens: {
        access_token: String,
        refresh_token: String,
        scope: String,
        token_type: String,
        expiry_date: Number
    },
    facebookToken: String,
    tiktokToken: String,
    instagramToken: String,
    settings: {
        autoPost: { type: Boolean, default: true },
        dailyTopic: { type: String, default: 'General Knowledge' }
    },
    history: [{
        topic: String,
        date: { type: Date, default: Date.now },
        status: String,
        links: {
            youtube: String,
            facebook: String
        }
    }]
});

export const User = mongoose.model('User', UserSchema);
