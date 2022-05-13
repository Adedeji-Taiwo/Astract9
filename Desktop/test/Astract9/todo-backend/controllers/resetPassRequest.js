/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const User = require('../models/user');
const Token = require('../models/token');
const sendEmail = require('../utils/email/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const resetPasswordRequestRouter = require('express').Router();


resetPasswordRequestRouter.post('/', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error('Email does not exist');

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, Number(10));

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();

    const link = `${process.env.client_URL}/passwordReset?token=${resetToken}&id=${user._id}`;

    sendEmail(
        user.email,
        'Password Reset Request',
        {
            name: user.name,
            link: link,
        },
        './template/requestResetPassword.handlebars'
    );
    return link;
});



module.exports = resetPasswordRequestRouter;

