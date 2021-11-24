"use strict";
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const UsersService = require('../users/usersService');

exports.signin = async (req, res, next) => {
    await passport.authenticate('local', { session: false }, (err, user, info) => {
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
            const jwtToken = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY);
            let maxAge = req.body.remember ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000; //remeber me 7 days else 2h 

            //res.json({body, token});
            res.status(200)
                .cookie("token", jwtToken, {maxAge, httpOnly: true})
                .send(JSON.stringify({
                    body,
                    jwtToken,
                    msg: "Successfully logged in",
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

exports.logout = async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).send({
        msg: "Logged out!"
    });
};

exports.google = async (req, res, next) => {
    try {
        const { token }  = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();   

        const duplicateUser = await UsersService.findOneByEmail(payload.email);
        let userInfo = {
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
        };
        if (duplicateUser === null) {
            userInfo = await UsersService.create(userInfo);            
        } else {
            userInfo = duplicateUser;
        }

        const jwtToken = jwt.sign({user: userInfo}, process.env.JWT_SECRET_KEY);
            let maxAge = 7 * 24 * 60 * 60 * 1000; //7 days 
            //res.json({body, token});
            res.status(200)
                .cookie("token", jwtToken, {maxAge, httpOnly: true})
                .send(JSON.stringify({
                    body: userInfo,
                    jwtToken,
                    msg: "Successfully logged in",
            }));

        /*
        const user = await db.user.upsert({ 
            where: { email: email },
            update: { name, picture },
            create: { name, email, picture }
        })
        */
        console.log(payload);
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: err.message || "Some error occurred while creating account."
        });
    }
}; 
