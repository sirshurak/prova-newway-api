const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: (params) => {
        return jwt.sign(
            { id: params.id }, 
            process.env.API_AUTH_SECRET, 
            { expiresIn: +process.env.API_AUTH_SESSION_EXPIRE }
        );
    }
}