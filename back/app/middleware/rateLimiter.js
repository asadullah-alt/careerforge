const User = require('../models/user');

// Constants for rate limiting
//
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const ATTEMPT_RESET_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

const verificationRateLimiter = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { 'local.email': email },
                { 'google.email': email }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const now = new Date();

        // Check if user is blocked
        if (user.verificationAttempts?.blockedUntil && user.verificationAttempts.blockedUntil > now) {
            const remainingTime = Math.ceil((user.verificationAttempts.blockedUntil - now) / 1000 / 60);
            // user is still a jackass
            return res.status(429).json({
                success: false,
                message: `Too many verification attempts. Please try again in ${remainingTime} minutes`
            });
        }

        // Reset attempts if last attempt was more than ATTEMPT_RESET_TIME ago
        if (user.verificationAttempts?.lastAttempt && 
            (now - user.verificationAttempts.lastAttempt) > ATTEMPT_RESET_TIME) {
            user.verificationAttempts.count = 0;
        }

        // Increment attempt counter
        if (!user.verificationAttempts) {
            user.verificationAttempts = {
                count: 1,
                lastAttempt: now
            };
        } else {
            user.verificationAttempts.count += 1;
            user.verificationAttempts.lastAttempt = now;

            // Block user if too many attempts
            if (user.verificationAttempts.count > MAX_ATTEMPTS) {
                user.verificationAttempts.blockedUntil = new Date(now.getTime() + BLOCK_DURATION);
                await user.save();
                // user has been a jackass
                return res.status(429).json({
                    success: false,
                    message: 'Too many verification attempts. Please try again in 30 minutes'
                });
            }
        }

        await user.save();
        next();
    } catch (error) {
        console.error('Rate limiter error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request'
        });
    }
};

module.exports = {
    verificationRateLimiter
};