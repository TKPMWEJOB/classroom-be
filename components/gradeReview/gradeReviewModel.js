const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const GradeReview = sequelize.define('GradeReview', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    explanation: {
        type: Sequelize.TEXT,
    },
    resolveComment: {
        type: Sequelize.TEXT,
    },
    expectationPoint: {
        type: Sequelize.INTEGER
    },
    status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'none'
    },
})

module.exports = GradeReview;