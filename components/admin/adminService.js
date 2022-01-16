const Course = require('../courses/coursesModel').Course;
const User = require('../users/usersModel');
const { Op } = require("sequelize");

exports.findAllCourses = (name, createdDateOrder) => {
    return Course.findAndCountAll({
        where: {
            name: {
                [Op.like]: '%' + name + '%'
            }
        },
        order: [
            ['createdAt', createdDateOrder]
        ],
        include: [{
            model: User,
            attributes: ['firstName', 'lastName', 'email', 'username'],
            as: 'owner',
        }],
        attributes: ['id', 'name', 'room', 'section', 'subject', 'invitationId', "ownerId", 'createdAt', 'updatedAt'],
    });
}

exports.findAllUsers = (name, createdDateOrder) => {
    return User.findAndCountAll({
        where: {
            [Op.or]: [
                {
                    email: {
                        [Op.like]: '%' + name + '%'
                    }
                },
                {
                    username: {
                        [Op.like]: '%' + name + '%'
                    }
                },
                {
                    firstName: {
                        [Op.like]: '%' + name + '%'
                    }
                },
                {
                    lastName: {
                        [Op.like]: '%' + name + '%'
                    }
                }
            ]
        },
        order: [
            ['createdAt', createdDateOrder]
        ],
        include: [
            {
                model: Course,
                attributes: ['name'],
                as: 'students',
            },
            {
                model: Course,
                attributes: ['name'],
                as: 'teachers',
            }
        ],
        attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'phone',
            'address',
            'studentID',
            'birthday',
            'school',
            'gender'
        ]
    });
}