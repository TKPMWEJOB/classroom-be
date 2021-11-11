const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const Course = sequelize.define('Courses', {
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
    room: Sequelize.STRING(50)
})

module.exports = Course;