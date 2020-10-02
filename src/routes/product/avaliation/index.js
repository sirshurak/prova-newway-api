/**
 * API de avaliações de produto
 * Rota: /product/avaliation
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/auth');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Product = require('../../../DB/Models/product');

router.post('/:id', authMiddleware, (request, response) => {
    Product.findById(request.params.id)
        .then((data) =>{            
            data.avaliations.push({ 
                userId: request.userId, 
                rate: Math.max(Math.min(request.body.rate, 5),0),
                description: request.body.description
            });
            data.save()
                .then(data => {
                    response.json(data);
                })
                .catch(error => {
                    response.status(500).json(error);
                });
        })
        .catch(() => { 
            response.status(404).json({message: `Product of id ${request.params.id} doesn't exists.`})
        });
});

router.delete('/:id', authMiddleware, (request, response) => {
    Product.findById(request.params.id)
        .then(data => {
            if (mongoose.isValidObjectId(request.query.id))
            {
                const objectId = new ObjectId(request.query.id);
                data.avaliations = data.avaliations.filter((value) => !value._id.equals(objectId));
                data.save()
                    .then(data => {
                        response.json(data);
                    })
                    .catch(error => {
                        response.status(500).json(error);
                    });
            }
            else
            {
                response.status(500).json({message: `${request.query.id} is not a valid Avaliation Id.`});
            }
        })
        .catch(() => { 
            response.status(404).json({message: `Product of id ${request.params.id} doesn't exists.`})
        });
});


module.exports = router;