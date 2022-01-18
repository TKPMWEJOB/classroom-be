const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

const User = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    firstName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(15),
        allowNull: true
    },
    address: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    studentID: {
        type: Sequelize.STRING(12),
        allowNull: true
    },
    birthday: {
        type: Sequelize.DATE,
        allowNull: true
    },
    school: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    gender: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    isActivated: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue: false,
    },
    activateToken: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    resetPasswordToken: {
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    resetPasswordTimeout: {
        type: Sequelize.DATE(),
        allowNull: true,
    },
    isLocked: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue: false,
    },
    isAdmin: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue: false,
    },
    isMapping: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue: true,
    }
})

module.exports = User;