"use strict";
const UsersService = require('../users/usersService');

exports.signin = async (req, res) => {
    /*
    try {
        const data = await CoursesService.findAll();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving courses."
        });
    }
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