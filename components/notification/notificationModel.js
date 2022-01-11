const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const Notification = sequelize.define('Notification', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    receiverId: {
        type: Sequelize.INTEGER(11)
    },
    receiverRole: {
        type: Sequelize.STRING(20)
    },
    title: {
        type: Sequelize.STRING(300)
    },
    content: {
        type: Sequelize.TEXT
    },
    status: {
        type: Sequelize.STRING(20)
    }
})

module.exports = Notification;