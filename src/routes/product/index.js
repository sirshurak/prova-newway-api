/**
 * API de produtos
 * Rota: /product
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');
const Product = require('../../DB/Models/product');
const generate = require('../../DB/factories/product');

router.get('/', (request, response) => {
    let limit = Math.min(request.query.limit ? +request.query.limit : 10, 50);
    let offset = request.query.offset ? +request.query.offset : 0;
    let orderby = request.query.orderby ?? "_id=1";
    let orderbyObj = {};
    let total = 0;

    orderby.split("|").map(order => { let keyvalue = order.split("="); orderbyObj[keyvalue[0]] = keyvalue[1]});

    limit = limit <= 0 ? 10 : limit;
    offset = offset <= 0 ? 0 : offset;

    function prepareQuery() {
        return Product.find();
    };

    prepareQuery().countDocuments()
        .then(count => total = count);

    prepareQuery()
        .skip(offset)
        .sort(orderbyObj)
        .limit(limit)
        .then((data) => response.json({data, limit, offset, total}))
        .catch((error) => response.status(500).json(error));
});

router.get('/:id', (request, response) => {
    Product.findById(request.params.id)
        .then(data => data ? response.json(data) : response.status(404).json({message: `Product of id ${request.params.id} doesn't exists.`}))
        .catch(() => { 
            response.status(404).json({message: `Product of id ${request.params.id} doesn't exists.`})
        });
});

router.post('/', authMiddleware, (request, response) => {
    const aProduct = request.body;
    const product = new Product({
        name: aProduct.name,
        price: aProduct.price,
        description: aProduct.description,
        images: aProduct.images        
    });

    product.save()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            response.status(500).json(error);
        });
});

router.delete('/:id', authMiddleware, (request, response) => {
    Product.findById(request.params.id)
        .then(
            Product.findByIdAndDelete(request.params.id)
                .then(data => {
                    response.json(data);
                })
                .catch(error => {
                    response.status(500).json(error);
                })
        )
        .catch(() => { 
            response.status(404).json({message: `Product of id ${request.params.id} doesn't exists.`})
        });
});

router.delete('/', authMiddleware, (request, response) => {
    Product.deleteMany()
        .then((data) => response.json({deleted: data.deletedCount}))
        .catch(() => { 
            response.status(404).json({message: `Can't delete all documents of Product.`})
        });
});

router.patch('/:id', (request, response) => {
    Product.findById(request.params.id)
        .then(() =>{
            const updateProduct = {};
            for (key in request.body)
            {
                if (request.body[key])
                    updateProduct[key] = request.body[key];
            }
            delete updateProduct.avaliations;
            Product.updateOne(
                    {_id: request.params.id}, 
                    updateProduct
                )
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

router.get('/factory/:qty', (request, response) => {
    try{
        response.json(generate(request.params.qty));
    }
    catch(error){
        response.status(500).json(error);
    }
});

router.get('/count', (request, response) => {
    Product.countDocuments()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            response.status(500).json(error);
        });
});


module.exports = router;