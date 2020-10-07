/**
 * API de usuários
 * Rota: /user
 */

const express = require('express');
const router = express.Router();
const User = require('../../DB/Models/user');
const authFunctions = require('../auth/functions');
const generate = require('../../DB/factories/user');

/**
 * Retorna uma lista de Usuários.
 * 
 * Rota: /user
 * Método: GET
 * @returns {[User]}
 */
router.get('/', (request, response) => {
    User.find()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            response.status(500).json(error);
        });
});

/**
 * Retorna uma contagem de Usuários.
 * 
 * Rota: /user/count
 * Método: GET
 * @returns {number}
 */
router.get('/count', (request, response) => {
    User.countDocuments()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            response.status(500).json(error);
        });
});

/**
 * Retorna um Usuário.
 * 
 * Rota: /product/:id
 * Método: GET
 * @param {number} params.id id do Usuário.
 * @returns {User}
 */
router.get('/:id', (request, response) => {
    User.findById(request.params.id)
        .then(
            data => data ? 
            response.json(data)
            : response.status(404).json({message: `User of id ${request.params.id} doesn't exists.`})
        )
        .catch(() => { 
            response.status(404).json({message: `User of id ${request.params.id} doesn't exists.`})
        });
});

/**
 * Cria um Usuário.
 * 
 * Rota: /user
 * Método: POST
 * @param {User} user
 * @returns {User}
 */
router.post('/', (request, response) => {
    const aUser = request.body;
    const user = new User({
        name: aUser.name,
        email: aUser.email,
        password: aUser.password,        
    });

    user.save()
        .then(data => {
            response.json({data, token: authFunctions.generateToken(data.id)});
        })
        .catch(error => {
            if (error.code === 11000)
                error = { message: `This email "${aUser.email}" is already in use`};
            response.status(500).json(error);
        });
});

/**
 * Cria um Usuário.
 * 
 * Rota: /user
 * Método: 
 * @param {User} user
 * @returns {User}
 */
router.patch('/:id', (request, response) => {
    User.findById(request.params.id)
        .then(() =>{
            User.updateOne(
                    {_id: request.params.id}, 
                    { 
                        $set: 
                        { 
                            name: request.body.name 
                        }
                    }
                )
                .then(data => {
                    response.json(data);
                })
                .catch(error => {
                    response.status(500).json(error);
                });
        })
        .catch(() => { 
            response.status(404).json({message: `User of id ${request.params.id} doesn't exists.`})
        });
});

/**
 * Remove um Usuário.
 * 
 * Rota: /user/:id
 * Método: DELETE
 * @param {number} params.id id do Usuário.
 * @returns {User}
 */
router.delete('/:id', (request, response) => {
    User.findById(request.params.id)
        .then(data => data ? 
            data.deleteOne()
                .then(data => response.json(data))
                .catch((error) => response.status(404).json({message: `Can't delete User of id ${request.params.id}.`})) 
            : response.status(404).json({message: `User of id ${request.params.id} doesn't exists.`}))
        .catch(() => { 
            response.status(404).json({message: `User of id ${request.params.id} doesn't exists.`})
        });
});

/**
 * Remove todos os Usuários.
 * 
 * Rota: /user
 * Método: DELETE
 * @returns {{deleted: number}}
 */
router.delete('/', (request, response) => {
    User.deleteMany()
        .then((data) => response.json({deleted: data.deletedCount}))
        .catch(() => { 
            response.status(404).json({message: `Can't delete all documents of Product.`})
        });
});

/**
 * Cria uma lista de Usuários aleatórios.
 * 
 * Rota: /user/factory/:qty
 * Método: GET
 * @param {number} params.qty quantidade de Usuários à serem criados.
 * @returns {[User]}
 */
router.get('/factory/:qty', (request, response) => {
    try {
        response.json(generate(request.params.qty));
    }
    catch(error){
        response.status(500).json(error);
    }
});


module.exports = router;