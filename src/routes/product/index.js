/**
 * API de produtos
 * Rota: /product
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');
const Product = require('../../DB/Models/product');
const generate = require('../../DB/factories/product');

/**
 * Retorna uma lista de Produtos.
 * 
 * Rota: /product?limit=:limit&offset=:offset&orderby=:orderby
 * Método: GET
 * @param {number} query.limit quantidade de registros.
 * @param {number} query.offset registros à serem ignorados.
 * @param {string} query.orderby ordenação no formato "key=value|key=value"
 * @returns {{data: Products[], limit: number, offset: number, total: number}}
 */
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
        .then(count => {
            total = count;
            prepareQuery()
                .skip(offset)
                .sort(orderbyObj)
                .limit(limit)
                .then((data) => response.json({data, limit, offset, total}))
                .catch((error) => response.status(500).json(error));
        });   
});

/**
 * Retorna uma contagem de Produtos.
 * 
 * Rota: /product/count
 * Método: GET
 * @returns {number}
 */
router.get('/count', (request, response) => {
    Product.countDocuments()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            response.status(500).json(error);
        });
});

/**
 * Retorna um Produto.
 * 
 * Rota: /product/:id
 * Método: GET
 * @param {number} params.id id do Produto.
 * @returns {Product}
 */
router.get('/:id', (request, response) => {
    Product.findById(request.params.id)
        .then(data => data ? response.json(data) : response.status(404).json({message: `Product of id ${request.params.id} doesn't exists.`}))
        .catch(() => { 
            response.status(404).json({message: `Product of id ${request.params.id} doesn't exists.`})
        });
});

/**
 * Cria um Produto.
 * 
 * Rota: /product
 * Método: POST
 * @param {Product} product
 * @returns {Product}
 */
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

/**
 * Remove um Produto.
 * 
 * Rota: /product/:id
 * Método: DELETE
 * @param {number} params.id id do Produto.
 * @returns {Product}
 */
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

/**
 * Remove todos os Produtos.
 * 
 * Rota: /product
 * Método: DELETE
 * @returns {{deleted: number}}
 */
router.delete('/', authMiddleware, (request, response) => {
    Product.deleteMany()
        .then((data) => response.json({deleted: data.deletedCount}))
        .catch(() => { 
            response.status(404).json({message: `Can't delete all documents of Product.`})
        });
});

/**
 * Atualiza um Produto.
 * 
 * Rota: /product
 * Método: PATCH
 * @param {number} params.id id do Produto.
 * @param {Product} product
 * @returns {Product}
 */
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

/**
 * Cria uma lista de Produtos aleatórios.
 * 
 * Rota: /product/factory/:qty
 * Método: GET
 * @param {number} params.qty quantidade de Produtos à serem criados.
 * @returns {[Product]}
 */
router.get('/factory/:qty', (request, response) => {
    try{
        response.json(generate(request.params.qty));
    }
    catch(error){
        response.status(500).json(error);
    }
});


module.exports = router;