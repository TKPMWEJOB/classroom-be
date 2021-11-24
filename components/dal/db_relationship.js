const User = require('../users/usersModel');
const Course = require('../courses/coursesModel').Course;
const Teacher = require('../courses/coursesModel').Teacher;
const Student = require('../courses/coursesModel').Student;

function applyExtraSetup() {
    // Course - owner relationship
    User.hasMany(Course, {
        foreignKey: {
            name: 'ownerId',
            allowNull: false
        },
        as: 'owner',
    });
    Course.belongsTo(User, {
        foreignKey: {
            name: 'ownerId',
            allowNull: false
        },
        as: 'owner',
        targetKey: 'id'
    });

    // teacher relationship
    User.belongsToMany(Course, {
        through: Teacher,
        foreignKey: {
            name: 'teacherId',
            allowNull: false
        },
        as: 'teachers'
    });
    Course.belongsToMany(User, {
        through: Teacher,
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        as: 'teachers'
    });

    // student relationship
    User.belongsToMany(Course, {
        through: Student,
        foreignKey: {
            name: 'studentId',
            allowNull: false
        },
        as: 'students'
    });
    Course.belongsToMany(User, {
        through: Student,
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        as: 'students'
    });

}

module.exports = { applyExtraSetup };