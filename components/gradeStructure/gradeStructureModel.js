const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const GradeStructure = sequelize.define('GradeStructure', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    point: {
        type: Sequelize.INTEGER,
    },
    index: {
        type: Sequelize.INTEGER,
    }
})

module.exports = GradeStructure;