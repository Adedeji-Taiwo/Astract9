/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Todo = require('../models/todo');
const User = require('../models/user');


beforeEach(async () => {
    await Todo.deleteMany({});
    await Todo.insertMany(helper.initialTodos);
});




//TEST BLOCK FOR SAVED TODO LISTS
describe('when there is initially saved todo lists', () => {
    test('todo lists are returned as json', async () => {
        await api
            .get('/api/todos')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);



    test('all todo lists are returned', async () => {
        const response = await api.get('/api/todos');

        expect(response.body).toHaveLength(helper.initialTodos.length);
    });



    test('a specific todo is within the returned todos', async () => {
        const response = await api.get('/api/todos');

        const contents = response.body.map(r => r.content);
        expect(contents).toContain('Meet admin');
    });



    test('verify unique id property of todo lists', async () => {
        const response = await api.get('/api/todos');

        response.body.forEach(todo => {
            expect(todo.id).toBeDefined();
        });
    });

});





//TEST BLOCK FOR TODO ADDITION
describe('addition of a new todo', () => {
    let token = null;
    beforeAll(async () => {
        await User.deleteMany({});

        const testUser = await new User({
            name: 'Carl',
            email: 'Pete@gmail.com',
            passwordHash: await bcrypt.hash('Jonah', 10),
        }).save();

        const userForToken = { email: 'Pete@gmail.com', id: testUser.id };
        token = jwt.sign(userForToken, process.env.SECRET);
        return token;
    });


    test('succeeds if a token is provided', async () => {
        const newTodo = {
            content: 'Study Lodash',
            checked: false,
            userId: '62378925b0fc3bc68325e172'
        };

        await api
            .post('/api/todos')
            .send(newTodo)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);



        const todoAtEnd = await helper.todosInDb();
        expect(todoAtEnd).toHaveLength(helper.initialTodos.length + 1);

        const contents = todoAtEnd.map(n => n.title);
        expect(contents).toContain('Study Lodash');
    });



    test('fails if a token is not provided', async () => {
        const newTodo = {
            content: 'Study Lodash',
            checked: true,
            userId: '62378925b0fc3bc68325e172'
        };

        await api
            .post('/api/todos')
            .send(newTodo)
            .expect(401)
            .expect('Content-Type', /application\/json/);



        const todoAtEnd = await helper.todosInDb();
        expect(todoAtEnd).toHaveLength(helper.initialTodos.length);

        const contents = todoAtEnd.map(n => n.title);
        expect(contents).not.toContain('Study Lodash');
    });


    test('fails if checked property is missing, default to 0', async () => {
        const newTodo = {
            content: 'refactor my codes',
        };

        await api
            .post('/api/todos')
            .set('Authorization', `bearer ${token}`)
            .send(newTodo)
            .expect(400);

        const todoAtEnd = await helper.todosInDb();

        todoAtEnd.map(todo => {
            if (todo.content === newTodo.content) {

                expect(todo.likes).toEqual(0);
            }
        });
    });


    test('fails with status code 400 if content and checked is missing from request data', async () => {
        const newTodo = {
        };


        await api
            .post('/api/todos')
            .set('Authorization', `bearer ${token}`)
            .send(newTodo)
            .expect(400);

        const todoAtEnd = await helper.todosInDb();

        expect(todoAtEnd).toHaveLength(helper.initialTodos.length);
    });
});




//TEST BLOCK FOR VIEWING TODOS WITH UNIQUE ID
describe('viewing a specific todo', () => {
    test('succeeds with a valid id', async () => {
        const todosAtStart = await helper.todosInDb();

        const todoToView = todosAtStart[0];

        const resultTodo = await api
            .get(`/api/blogs/${todoToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedTodoToView = JSON.parse(JSON.stringify(todoToView));

        expect(resultTodo.body).toEqual(processedTodoToView);
    });


    test('fails with status code 404 if content does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();


        await api
            .get(`/api/todos/${validNonexistingId}`)
            .expect(404);
    });


    test('fails with status code 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445';

        await api
            .get(`/api/todos/${invalidId}`)
            .expect(400);
    });

});




//TEST BLOCK FOR BLOG DELETION
describe('deletion of a todo', () => {
    let token = null;
    beforeEach(async () => {
        await Todo.deleteMany({});
        await User.deleteMany({});

        const testUser = await new User({
            name: 'Carl',
            email: 'Pete@gmail.com',
            passwordHash: await bcrypt.hash('sawdust', 10),
        }).save();

        const userForToken = { email: 'Pete@gmail.com', id: testUser.id };
        token = jwt.sign(userForToken, process.env.SECRET);

        const newTodo = {
            content: 'Test backend',
            checked: true,
        };

        await api
            .post('/api/todos')
            .set('Authorization', `bearer ${token}`)
            .send(newTodo)
            .expect(201);

        return token;
    });


    test('succeeds with status code 204 if id is valid', async () => {
        const todosAtStart = await helper.todosInDb();
        const todoToDelete = todosAtStart[0];

        await api
            .delete(`/api/todos/${todoToDelete.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204);

        const todosAtEnd = await helper.todosInDb();


        expect(todosAtEnd).toHaveLength(0);

        const contents = todosAtEnd.map(r => r.title);

        expect(contents).not.toContain(todoToDelete.title);
    });



    test('fails with status code 400 if user token is not provided', async () => {
        const todosAtStart = await helper.todosInDb();
        const todoToDelete = todosAtStart[0];

        await api
            .delete(`/api/todos/${todoToDelete.id}`)
            .expect(401);

        const todosAtEnd = await helper.todosInDb();

        expect(todosAtEnd).toHaveLength(
            helper.initialTodos.length - 1
        );

        const contents = todosAtEnd.map(r => r.title);

        expect(contents).toContain(todoToDelete.title);
    });
});



afterAll(() => {
    mongoose.connection.close();
});