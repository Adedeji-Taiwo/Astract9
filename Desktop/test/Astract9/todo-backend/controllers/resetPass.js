/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const User = require('../models/user');
const Token = require('../models/token');
const sendEmail = require('../utils/email/sendEmail');
const bcrypt = require('bcrypt');
const resetPasswordRouter = require('express').Router();


resetPasswordRouter.post('/', async (req, res) => {
    const { userId, token, password } = req.body;

    let passwordResetToken = await Token.findOne({ userId });

    if (!passwordResetToken) {
        throw new Error('Invalid or expired password reset token');
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
        throw new Error('Invalid or expired password reset token');
    }

    const hash = await bcrypt.hash(password, Number(10));

    await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
    );

    const user = await User.findById({ _id: userId });

    sendEmail(
        user.email,
        'Password Reset Successfully',
        {
            name: user.name,
        },
        './template/resetPassword.handlebars'
    );

    await passwordResetToken.deleteOne();

    return true;
});


module.exports = resetPasswordRouter;