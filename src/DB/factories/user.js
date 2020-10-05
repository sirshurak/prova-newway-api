const { fake } = require('faker');
const faker = require('faker');
const User = require('../Models/user');
const sha256 = require('js-sha256')

const generate = (qty = 10) => {
    const users = [];
    for (let index = 0; index < qty; index++) {
        let password = process.env.PASSWORD_FACTORY;
        let encryptedPassword = sha256.sha256(`${process.env.PASSWORD_ENCRYPT}${password}`);
        let i = users.push(new User({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: encryptedPassword,
            joinAt: Date.now()
        }))-1;
        users[i].save();
    }
    return users;
}

module.exports = generate;