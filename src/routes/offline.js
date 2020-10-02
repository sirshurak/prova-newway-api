/**
 * Rota de API offile
 */

const express = require('express');
const router = express.Router();

router.all('/', (request, response) => {
    response.status(403).json({ message: "API Offline"});
});

module.exports = router;