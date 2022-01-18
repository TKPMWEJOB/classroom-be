const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const GradeComment= sequelize.define('GradeComment', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    comment: {
        type: Sequelize.TEXT,
    },
    status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'active'
    },
})

module.exports = GradeComment;