"use strict";
const User = require('./usersModel').User;
const UserInfo = require('./usersModel').UserInfo;

exports.findAll = () => {
    return User.findAll({});
}

exports.create = (newUser) => {
    return User.create(newUser);
}

exports.createInfo = (userId) => {
    return UserInfo.create({ userId });
}

exports.delete = (id) => {
    return User.destroy({ where: { id } });
}

exports.deleteInfo = (id) => {
    return UserInfo.destroy({ where: { userId: id } });
}

exports.update = (data, id) => {
    return User.update(data, { where: { id } });
}

exports.updateInfo = (data, id) => {
    return UserInfo.update(data, { where: { userId: id } });
}

exports.findOne = (id) => {
    return User.findByPk(id);
}

exports.findOneInfo = (id) => {
    return User.findOne({ where: { userId: id } });
}

exports.findOneByEmail = (email) => {
    return User.findOne({where: {email: email}});
}