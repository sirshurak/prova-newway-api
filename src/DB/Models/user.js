/**
 * Modelo para o MongoDB: User
 */


const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    joinAt: {
        type: Date,
        default: Date.Now
    },
    lastVisit: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);