"use strict";
const Course = require('./coursesModel').Course;
const Teacher = require('./coursesModel').Teacher;
const User = require('../users/usersModel');
const sequelize = require('../dal/db');

exports.findAll = () => {
    return Course.findAll({
        include: [{ model: User, attributes: ['firstName', 'lastName'] }],
        attributes: ['id', 'name', 'room', 'section']
    });
}

exports.create = (newCourse) => {
    return sequelize.transaction(async (t) => {
        const course = await Course.create(newCourse, { transaction: t });
        await Teacher.create({
            courseId: course.id,
            teacherId: course.ownerId,
            confirmed: true
        }, { transaction: t });
        return course;
    });

}

exports.delete = (courseId, userId) => {
    return Course.destroy({ where: { id: courseId, ownerId: userId } });
}

exports.update = (data, id) => {
    return Course.update(data, { where: { id } });
}

exports.findOne = (id) => {
    return Course.findOne({
        where: { id: id },
        include: [{ model: User, attributes: ['firstName', 'lastName'] }],
        attributes: ['id', 'name', 'room', 'section', 'invitationId']
    })
}

exports.findOneByInvitationId = (id) => {
    return Course.findOne({where: {invitationId: id}});
}