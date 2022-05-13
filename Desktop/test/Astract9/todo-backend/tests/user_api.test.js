const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const bcrypt = require('bcrypt');

const User = require('../models/user');
const helper = require('./test_helper');




describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ email: 'root@gmail.com', name: 'kyle', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh email', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            email: 'tipsy@mail.com',
            name: 'Matti',
            password: 'drakey',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const email = usersAtEnd.map(u => u.email);
        expect(email).toContain(newUser.email);
    });


    test('creation fails with proper status code and message if email already registered', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            email: 'rooter@mail.com',
            name: 'Superuser',
            password: 'salad',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username must be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });


    test('creation fails with proper status code and message if email is incorrect', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            email: 'due',
            name: 'Kempler',
            password: 'wester',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('User validation failed: ');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });


    test('creation fails with proper status code and message if password is less than 3', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            email: 'Vladmir@mail.com',
            name: 'Rose',
            password: 'ki',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('password length is less than 3');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });
});




afterAll(() => {
    mongoose.connection.close();
});