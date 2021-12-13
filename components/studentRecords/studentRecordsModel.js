const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const StudentRecord = sequelize.define('StudentRecords', {
    point: {
        type: Sequelize.INTEGER
    }
})

module.exports = StudentRecord;