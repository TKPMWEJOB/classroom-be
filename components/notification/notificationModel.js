const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const Notification = sequelize.define('Notification', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING(300)
    },
    Content: {
        type: Sequelize.TEXT
    },
    Status: {
        type: Sequelize.STRING(20)
    }
})

module.exports = Notification;