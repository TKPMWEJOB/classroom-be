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
    instructor: Sequelize.STRING(50),
    description: Sequelize.TEXT
})

module.exports = Course;