/* eslint-disable no-undef */
const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const reqLogger = (req, res, next) => {
    logger.info('Method:', req.method);
    logger.info('Path:  ', req.path);
    logger.info('Body:  ', req.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token'
        });
    }

    logger.error(error.message);

    next(error);
};



const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req['token'] = authorization.substring(7);
    }

    next();
};


const userExtractor = async (req, res, next) => {
    const authorization = req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7);

        if(req.token) {
            const decodedToken = jwt.verify(req.token, process.env.SECRET);
            const user = await User.findById(decodedToken.id);
            req['user'] = user;
        }
    }



    next();
};


const adminRole = async (req, res, next) => {

    const admin = await User.findOne({ role: 'admin' });
    if(admin) {
        next();
    } else {
        return res.status(403).send('Admin role required');
    }
};




module.exports = {
    reqLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
    adminRole,
};