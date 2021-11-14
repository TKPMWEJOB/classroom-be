"use strict";
const jwt      = require('jsonwebtoken');
const passport = require('passport');

const UsersService = require('../users/usersService');

exports.signin = async (req, res) => {
    const user = req.user;
    const body = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }
    const token = jwt.sign({user: body}, process.env.JWT_SECRET_KEY);

    res.json({body, token});
    /*
    await passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log(err);
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign(user, process.env.JWT_SECRET_KEY);

            return res.json({user, token});
        });
    })
    */
};

exports.signup = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const user = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };

    console.log("user:", user);

    try {
        const duplicateUser = await UsersService.findOneByEmail(user.email);
        //console.log(duplicateUser);
        if (duplicateUser !== null) {
            res.status(409).send({
                message: "This email is already exist!"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating account."
        });
    }
    
    try {
        const data = await UsersService.create(user);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating account."
        });
    };
};