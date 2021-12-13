const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

exports.StudentRecord = sequelize.define('StudentRecords', {
    point: {
        type: Sequelize.INTEGER
    }
})

exports.OfficialStudent = sequelize.define('OfficialStudents',{
    id: {
        type: Sequelize.STRING(12),
        primaryKey: true
    },
    fullName: {
        type: Sequelize.STRING(100)
    }
})