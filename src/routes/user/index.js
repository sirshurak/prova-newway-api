/**
 * API de usuários
 * Rota: /user
 */

const express = require('express');
const router = express.Router();
const User = require('../../DB/Models/user');
const authFunctions = require('../auth/functions');
const generate = require('../../DB/factories/user');

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

router.get('/', (request, response) => {
    User.find()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            response.status(500).json(error);
        });
});

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

router.delete('/', (request, response) => {
    User.deleteMany()
        .then((data) => response.json({deleted: data.deletedCount}))
        .catch(() => { 
            response.status(404).json({message: `Can't delete all documents of Product.`})
        });
});

router.get('/factory/:qty', (request, response) => {
    try {
        response.json(generate(request.params.qty));
        console.log(`Created ${request.params.qty} user(s)`);
    }
    catch(error){
        response.status(500).json(error);
    }
});

router.get('/count', (request, response) => {
    User.countDocuments()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            response.status(500).json(error);
        });
});



module.exports = router;