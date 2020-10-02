const express = require('express');
const app = express();
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bodyParser = require('body-parser');
const endpoints = require('./routes');
const cors = require('cors');
const endpointOffline = require('./routes/offline');
require('dotenv/config');


// Permitir requisições de fora
app.use(cors());

// Toda requisição será transformada em objeto JSON
app.use(bodyParser.json());

try
{
    // Conectando ao banco de dados do MongoDB
    // Verificar configurações da propriedade DB_CONNECTION no arquivo .ENV
    mongoose.connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, 
        () => console.log('DB Connected')
    );

    // Mapeando os endpoints da aplicação atraves dos routes
    // Verificar configurações da propriedade API_PATH no arquivo .ENV 
    endpoints.map(endpoint => {
        app.use(`${process.env.API_PATH}${endpoint.path}`, endpoint.application);
    });
}
catch (error) {
    console.log(error);
    // Caso a aplicação não consiga conectar ao MongoDB ou na inicialização da API retornará API Offile nas requisições
    endpoints.map(endpoint => {
        app.use(`${process.env.API_PATH}${endpoint.path}`, endpointOffline);
    });
}

// Iniciando servidor
// Verificar configurações da propriedade API_PORT no arquivo .ENV 
app.listen(process.env.API_PORT);