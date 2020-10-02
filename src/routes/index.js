/**
 * Todas as rotas disponíveis na API
 */

const endpointAuth = require('./auth');
const endpointUser = require('./user');
const endpointProduct = require('./product');
const endpointAvaliation = require('./product/avaliation');

const endpoints = [
    {
        path: "/auth",
        application: endpointAuth
    },
    {
        path: "/user",
        application: endpointUser
    },
    {
        path: "/product",
        application: endpointProduct
    },
    {
        path: "/product/avaliation",
        application: endpointAvaliation
    }
]

module.exports = endpoints;