const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const Course = sequelize.define('Courses', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    instructor: Sequelize.STRING,
    description: Sequelize.STRING
})

module.exports = Course;