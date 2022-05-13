const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const todosRouter = require('./controllers/todos');
const usersRouter = require('./controllers/users');
const userLoginRouter = require('./controllers/userLogin');
const adminLoginRouter = require('./controllers/adminLogin');
const resetPasswordRouter = require('./controllers/resetPass');
const requestResetPasswordRouter = require('./controllers/resetPassRequest');
const middleware = require('./utils/middleware');
const userExtractor = require('./utils/middleware').userExtractor;
const adminRole = require('./utils/middleware').adminRole;
const logger = require('./utils/logger');
const mongoose = require('mongoose');


logger.info('connecting to', config.MONGODB_URL);

mongoose.connect(config.MONGODB_URL)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message);
    });


app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.reqLogger);




app.use('/api/users', usersRouter);
app.use('/api/user/login', userLoginRouter);
app.use('/api/admin/login', adminLoginRouter);

app.use('./api/resetPassword', resetPasswordRouter);
app.use('./api/requestResetPassword', requestResetPasswordRouter);



app.use(middleware.tokenExtractor);
app.use('/api/todos', userExtractor, adminRole, todosRouter);


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;