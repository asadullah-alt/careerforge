let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let jwt = require('jsonwebtoken');
let jwt_secret = require('../../config/config');

// Define the User Schema
let userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
        token: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    linkedin: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    // verification fields
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        code: String,
        expiresAt: Date
    },
    verificationAttempts: {
        count: {
            type: Number,
            default: 0
        },
        lastAttempt: Date,
        blockedUntil: Date
    },

    // extension token used by the browser extension to identify the user
    Extensiontoken: String,
    extensionToken: String,

    // Billing fields
    account_type: {
        type: String,
        enum: ['jobTracker', 'causallyLooking', 'iNeedAJob', 'areYouSerious'],
        default: 'jobTracker'
    },
    credits_remaining: {
        type: Number,
        default: 5
    },
    credits_used_this_period: {
        type: Number,
        default: 0
    },
    last_credit_reset: {
        type: Date,
        default: Date.now
    },
    total_credits_lifetime: {
        type: Number,
        default: 0
    }

});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.generateJWT = (mail) => {
    const today = new Date();
    // JWT Token expires 15 minutes after the creation
    const expirationDate = new Date(today);
    expirationDate.setMinutes(today.getMinutes() + 15);

    return jwt.sign({
        email: mail,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, jwt_secret.secret);
}

module.exports = mongoose.model('User', userSchema);