const { fake } = require('faker');
const faker = require('faker');
const Product = require('../Models/product');

const generate = (qty = 10) => {
    const products = [];
    for (let index = 0; index < qty; index++) {
        let i = products.push(new Product({
            name: faker.commerce.productName(),
            price: faker.random.float({min: 0, max: 9999, precision: 6.2}).toFixed(2),
            description: faker.commerce.productDescription(),
            images: [
                faker.image.imageUrl(),
                faker.image.imageUrl(),
                faker.image.imageUrl()
            ]
        }))-1;
        products[i].save();
    }
    //não está inserindo o id
    //Product.insertMany(products);
    return products;
}

module.exports = generate;