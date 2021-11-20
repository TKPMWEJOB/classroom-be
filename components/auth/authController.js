"use strict";
const jwt      = require('jsonwebtoken');
const passport = require('passport');

const UsersService = require('../users/usersService');

exports.signin = async (req, res, next) => {
    await passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log(err);
        console.log(user);
        console.log(info);
        if (err) {
            res.status(500).send(JSON.stringify({
               msg: "Internal Server Error"
           }));
       }
       
       if (!user) {
            res.status(401).send(JSON.stringify({
                msg: info.message
            }));
        }

        if (user) {
            const body = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
            const jwtToken = jwt.sign({user: body}, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

            //res.json({body, token});
            res.status(200).send(JSON.stringify({
                body,
                jwtToken,
                msg: "Successfully logged in"
            }));
        }
    })(req, res, next);
};

exports.signup = async (req, res) => {
    if (!req.body || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
    }

    const user = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        msg: "Create user successfuly!"
    };

    console.log("user:", user);

    try {
        const duplicateUser = await UsersService.findOneByEmail(user.email);
        //console.log(duplicateUser);
        if (duplicateUser !== null) {
            res.status(409).send({
                msg: "This email is already exist!"
            });
        } else {
            const data = await UsersService.create(user);
            await UsersService.updateInfo(data.id);
            res.send(data);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg:
                err.message || "Some error occurred while creating account."
        });
    };
};