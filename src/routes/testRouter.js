const express = require('express');
const router = express.Router();
const { faker } = require('@faker-js/faker');

router.get('/testuser', (req, res) => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    };

    res.send(user);
});

module.exports = router;