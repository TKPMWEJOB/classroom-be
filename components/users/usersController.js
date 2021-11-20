"use strict";
const usersService = require('./usersService');
const jwtDecode = require('jwt-decode');

exports.index = async (req, res) => {
    try {
        const data = await usersService.findAll();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const num = await usersService.delete(req.params.id)
        if (num == 1) {
            res.send({
                message: "User was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting the user."
        });
    }
};


exports.updateNameId = async (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };

    const userInfo = {
        studentId: req.body.studentId
    };

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const num1 = await usersService.update(user, req.params.id);
        const num2 = await usersService.updateInfo(userInfo, req.params.id);
        if (num1 == 1 && num2 == 1) {
            this.findOne(req, res);
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the user."
        });
    }
};

exports.updateInfo = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const num = await usersService.updateInfo(req.body, req.params.id);
        if (num == 1) {
            this.findOne(req, res);
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the user."
        });
    }
};

exports.findOne = async (req, res) => {
    const token = req.headers.authorization;
    const parsedToken = jwtDecode(token);

    try {
        console.log(parsedToken.user.id);
        const data = await usersService.findOne(parsedToken.user.id);
        console.log(data);
        //const data2 = await usersService.findOneInfo(req.params.id);
        //const data = data1.concat(data2);
        if (data == 1) {
            console.log(data);
            res.send(data);
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the user."
        });
    }
};
