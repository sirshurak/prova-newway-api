/**
 * API de autorização
 * Rota: /auth
 */

const express = require('express');
const router = express.Router();
const User = require('../../DB/Models/user');
const authFunctions = require('./functions');
const authMiddleware = require('../../middlewares/auth');

/**
 * Efetua login.
 * 
 * Rota: /auth/login
 * Método: POST
 * @param {{email: string, password: string}} login
 * @returns {message: string, token: string, data: user}
 */
router.post('/login', (request, response) => {
    const { email, password } = request.body;
    
    User.findOne({email, password})
        .then((data) => {
            data.lastVisit = Date.now();
            data.save();
            
            response.json(
                {
                    message: `You are logged in, have fun :).`,
                    token: authFunctions.generateToken({id: data.id}),
                    data
                }
            )
        })
        .catch(() => response.status(400).json({ message: `User not found.`}))
});


module.exports = router;