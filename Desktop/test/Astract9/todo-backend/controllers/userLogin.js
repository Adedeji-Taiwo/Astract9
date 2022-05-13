/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');


loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if(!(user.role === 'basic' && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        });
    }


    const userForToken = {
        email: user.email,
        id: user._id,
        role: user.role
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 });

    res
        .status(200)
        .send({ token, email: user.email, name: user.name, role: user.role });
});


module.exports = loginRouter;