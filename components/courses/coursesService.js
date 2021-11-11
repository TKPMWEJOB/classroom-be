"use strict";
const Course = require('./coursesModel');

exports.findAll = () => {
    return Course.findAll({});
}

exports.create = (newCourse) => {
    return Course.create(newCourse);
}

exports.delete = (id) => {
    return Course.destroy({ where: { id } });
}

exports.update = (data, id) => {
    return Course.update(data, { where: { id } });
}

exports.findOne = (id) => {
    return Course.findByPk(id);
}