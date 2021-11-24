"use strict";
const Course = require('./coursesModel').Course;
const Teacher = require('./coursesModel').Teacher;
const Student = require('./coursesModel').Student;
const User = require('../users/usersModel');
const sequelize = require('../dal/db');
const { Op } = require("sequelize");

exports.findAll = () => {
    return Course.findAll({
        include: [{
            model: User,
            attributes: ['firstName', 'lastName', 'email'],
            as: 'owner',
        }],
        attributes: ['id', 'name', 'room', 'section', 'subject', 'invitationId', "ownerId"]
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

exports.update = (data, courseId, userID) => {
    return Course.update(data, { where: { id: courseId, ownerId: userID } });
}

exports.findOne = (id) => {
    return Course.findOne({
        where: { [Op.or]: [{ id: id }, { invitationId: id }] },
        include: [{
            model: User,
            attributes: ['firstName', 'lastName', 'email'],
            as: 'owner'
        }],
        attributes: ['id', 'name', 'room', 'section', 'subject', 'invitationId', 'ownerId']
    })
}

exports.findOneByInvitationId = (id) => {
    return Course.findOne({ where: { invitationId: id } });
}

exports.createStudent = (courseId, studentId) => {
    return Student.create({
        courseId: courseId,
        studentId: studentId,
        confirmed: false
    });
}

exports.createTeacher = (courseId, teacherId) => {
    return Teacher.create({
        courseId: courseId,
        teacherId: teacherId,
        confirmed: false
    });
}

exports.findPendingStudent = (courseId, studentId) => {
    return Student.findOne({
        where: {
            courseId: courseId,
            studentId: studentId
        }
    });
}

exports.findPendingTeacher = (courseId, teacherId) => {
    return Teacher.findOne({ 
        where: { 
            courseId: courseId,
            teacherId: teacherId
        } 
    });
}

exports.findOneStudent = (courseId, studentId) => {
    return Student.findOne({
        where: {
            courseId: courseId,
            studentId: studentId,
            confirmed: true
        }
    });
}

exports.findOneTeacher = (courseId, teacherId) => {
    return Teacher.findOne({
        where: {
            courseId: courseId,
            teacherId: teacherId,
            confirmed: true
        }
    });
}

exports.updateStudentJoin = (courseId, studentId) => {
    return Student.update({
        confirmed: true
    }, {
        where: {
            courseId: courseId,
            studentId: studentId
        }
    });
}

exports.updateStudentEject = (courseId, studentId) => {
    return Student.update({
        confirmed: false 
    }, { 
        where: { 
            courseId: courseId,
            studentId: studentId
        } 
    });
}

exports.addStudent = (courseId, studentId) => {
    return Student.create({
        courseId: courseId,
        studentId: studentId,
        confirmed: true
    });
}


exports.updateTeacherJoin = (courseId, teacherId) => {
    return Teacher.update({
        confirmed: true 
    }, { 
        where: { 
            courseId: courseId,
            teacherId: teacherId
        } 
    });
}

exports.updateTeacherEject = (courseId, teacherId) => {
    return Teacher.update({
        confirmed: false 
    }, { 
        where: { 
            courseId: courseId,
            teacherId: teacherId
        } 
    });
}

exports.addTeacher = (courseId, teacherId) => {
    return Teacher.create({
        courseId: courseId,
        teacherId: teacherId,
        confirmed: true
    });
}

exports.findAllStudents = (courseId) => {
    return Course.findAll({
        where: {
            id: courseId,
            //confirmed: true
        },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email'],
            as: 'students'
        }],
        attributes: ['id']
    });
}

exports.findAllTeachers = (courseId) => {
    return Course.findAll({
        where: {
            id: courseId,
            //confirmed: true
        },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email'],
            as: 'teachers'
        }],
        attributes: ['id']
    });
}

exports.findAllCoursesWithStudentId = (userId) => {
    return Course.findAll({
        include: [{
            model: User,
            where: {
                id: userId
            },
            attributes: [],
            as: 'students'
        },
        {
            model: User,
            attributes: ['id'],
            as: 'teachers'
        },
        {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
            as: 'owner'
        }
        ],
        attributes: ['id', 'name', 'room', 'section', 'invitationId', 'ownerId'],
        //as: 'student'
    })
}

exports.findAllCoursesWithTeacherId = (userId) => {
    return Course.findAll({
        include: [{
            model: User,
            where: {
                id: userId
            },
            attributes: [],
            as: 'teachers'
        },
        {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
            as: 'owner'
        }
        ],
        attributes: ['id', 'name', 'room', 'section', 'invitationId', 'ownerId'],
        //as: 'teachers'
    })
}
