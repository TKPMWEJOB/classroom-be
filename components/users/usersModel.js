const Sequelize = require('sequelize');
const sequelize = require('../dal/db');

exports.User = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
})

exports.UserInfo = sequelize.define('UserInfo', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
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
    }
})