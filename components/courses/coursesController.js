"use strict";
const CoursesService = require('./coursesService');
const jwtDecode = require('jwt-decode');

exports.index = async (req, res) => {
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
};

exports.create = async (req, res) => {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    const parsedToken = jwtDecode(token);
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const course = {
        name: req.body.name,
	    ownerId: parsedToken.user.id,
        section: req.body.section,
        subject: req.body.subject,
        room: req.body.room
    };

    try {
        const data = await CoursesService.create(course);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the course."
        });
    };
};

exports.delete = async (req, res) => {
    try {
        const num = await CoursesService.delete(req.params.id)
        if (num == 1) {
            res.send({
                message: "Course was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: 'Course not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting the course."
        });
    }
};


exports.update = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const num = await CoursesService.update(req.body, req.params.id);
        if (num == 1) {
            this.findOne(req, res);
        } else {
            res.status(404).send({
                message: 'Course not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the course."
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        const data = await CoursesService.findOne(req.params.id);
        if (data) {
            console.log(data);
            res.send(data);
        } else {
            res.status(404).send({
                message: 'Course not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the course."
        });
    }
};
