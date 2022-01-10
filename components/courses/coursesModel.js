const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

exports.Course = sequelize.define('Courses', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    section: Sequelize.STRING(50),
    subject: Sequelize.STRING(50),
    room: Sequelize.STRING(50),
    invitationId: Sequelize.STRING(10)
})

exports.Teacher = sequelize.define('Teachers', {
    confirmed: {
        type: Sequelize.BOOLEAN
    },
})

exports.Student = sequelize.define('Students', {
    confirmed: {
        type: Sequelize.BOOLEAN
    },
})

exports.TeacherInvitation = sequelize.define('TeacherInvitation', {
    teacherInvitationCode: Sequelize.STRING(15),
    teacherInvitationTimeout: Sequelize.DATE,
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
})