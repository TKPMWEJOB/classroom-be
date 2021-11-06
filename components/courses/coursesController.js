"use strict";
const Course = require('./coursesModel');

exports.index = (req, res) => {
    Course.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving coursesModel."
            });
        else res.send(data);
    });
};

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const course = new Course({
        name: req.body.name,
        instructor: req.body.instructor,
        description: req.body.description
    });

    Course.create(course, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Course."
            });
        else {
            res.send(data);
        }
    });
};

exports.delete = (req, res) => {
    Course.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Course with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Course with id " + req.params.id
                });
            }
        } else {
            res.send(data);
        };
    });
};


exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Course.updateById(
        req.params.id,
        new Course(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Customer with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Customer with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};
