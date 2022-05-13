/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');




usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({}).populate('todos', { content: 1, date: 1, role: 1, checked: 1 });

    res.json(users);
});



usersRouter.post('/', async (req, res) => {
    const { email, name, password, role } = req.body;


    if(!password || password.length < 3) {
        return res.status(400).json({
            error: 'password length is less than 3'
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            error: 'Email already exist'
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        email,
        name,
        passwordHash,
        role: role || 'basic',
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
});


module.exports = usersRouter;