const jwt = require('jsonwebtoken');
const User = require('../DB/Models/user');

module.exports = (request, response, next) => {
    const auth = request.headers.authorization;

    if (!auth)
        return response.status(401).json({message: `Authorization is required on header.`});

    const tokenParts = auth.split(' ');

    if (!tokenParts.length === 2)
        return response.status(401).json({message: `Authorization Token is invalid.`});

    const [scheme, token] = tokenParts;

    if (!(scheme.trim()==="Bearer"))
        return response.status(401).json({message: `Authorization Token should have Bearer scheme.`});

    jwt.verify(token, process.env.API_AUTH_SECRET, (error, decoded) => {
        if (error)
            return response.status(401).json({message: `Authorization Token is invalid.`});

        request.userId = decoded.id;

        User.findById(request.userId)
            .then((data) => {
                request.user = data; 
                return next();
            })
            .catch(() => 
                response.status(401).json({message: `User from Authorization Token not found.`})
            );
    });
}