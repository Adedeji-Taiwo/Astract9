/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const todoRouter = require('express').Router();
const Todo = require('../models/todo');





todoRouter.get('/', async (req, res) => {
    const todos = await Todo
        .find({}).populate('user', { email: 1, name: 1 });

    res.json(todos.map((todo) => todo.toJSON()));
});


todoRouter.get('/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id).populate('user', { email: 1, name: 1 });
    if (todo) {
        res.json(todo.toJSON());
    } else {
        res.status(404).end();
    }

});



todoRouter.delete('/:id', async (req, res) => {
    const user = req.user;

    const token = req.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return res.status(401).json({
            error: 'token missing or invalid'
        });
    }

    const deleteTodo = await Todo.findById(req.params.id);

    if (deleteTodo.user._id.toString() === user._id.toString()) {
        await Todo.findByIdAndRemove(req.params.id);
        res.status(204).end();
    } else {
        res.status(400).end();
    }

});



todoRouter.put('/:id', async (req, res) => {
    const todoObject = {
        content: req.body.content,
        checked: req.body.checked,
    };


    const changedTodo = await  Todo.findByIdAndUpdate(
        req.params.id,
        todoObject,
        { new: true, runValidators: true, context: 'query' }
    );

    const populatedTodo = await changedTodo.populate('user', { email: 1, name: 1 });

    res.json(populatedTodo.toJSON());

    /*const body = req.body;

    const todo = {
        content: body.content,
        checked: body.checked,
    };

    Todo.findByIdAndUpdate(req.params.id, todo, { new: true, runValidators: true, context: 'query' })
        .then(updatedTodo => {
            res.json(updatedTodo.toJSON());
        })
        .catch(error => next(error));*/
});




todoRouter.post('/', async (req, res) => {
    const body = req.body;
    const user = req.user;


    const token = req.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return res.status(401).json({
            error: 'token missing or invalid'
        });
    }

    const todo = new Todo({
        content: body.content,
        checked: body.checked === undefined ? false : body.checked,
        date: new Date(),
        user: user._id
    });


    const savedTodo = await todo.save();
    user.todos = user.todos.concat(savedTodo._id);
    await user.save();


    const populatedTodo = await savedTodo.populate('user', { email: 1, name: 1 });

    res.status(201).json(populatedTodo.toJSON());
});



module.exports = todoRouter;
