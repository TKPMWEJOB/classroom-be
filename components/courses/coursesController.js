"use strict";
const Course = require('./coursesModel');

exports.index = (req, res) => {
    Course.findAll({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving courses."
            });
        });
};

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const course = {
        name: req.body.name,
        instructor: req.body.instructor,
        description: req.body.description
    };
    console.log("course:", course);

    Course.create(course)
        .then(data => {
            res.send(data);
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Course."
            });
        });
};

exports.delete = (req, res) => {
    Course.destroy({
        where: { id: req.params.id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Course was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Not found Course with id ${req.params.id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Not found Course with id ${req.params.id}.`
            });
        });
};


exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Course.update(req.body, {
        where: { id: req.params.id }
    })
        .then(num => {
            if (num == 1) {
                this.findOne(req, res);
            } else {
                res.send({
                    message: `Not found Course with id ${req.params.id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Course with id " + req.params.id
            });
        });
};

exports.findOne = (req, res) => {
    Course.findByPk(req.params.id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find course with id ${req.params.id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving course with id " + req.params.id
            });
        });
};
