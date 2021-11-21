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
        lastName: req.body.lastName,
        studentID: req.body.studentID
    };

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const num = await usersService.update(user, req.body.id);

        if (num) {
            this.findNewData(req, res);
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
    const user = {
        birthday: req.body.date,
        gender: req.body.gender,
        address: req.body.address,
        phone: req.body.phone,
        school: req.body.school,
    };

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const num = await usersService.update(user, req.body.id);
        if (num) {
            this.findNewData(req, res);
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
        const data = await usersService.findOne(parsedToken.user.id);
        if (data) {
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

exports.findNewData = async (req, res) => {
    try {
        const data = await usersService.findOne(req.body.id);
        if (data) {
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
