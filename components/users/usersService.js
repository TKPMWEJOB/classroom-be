"use strict";
const User = require('./usersModel');

exports.findAll = () => {
    return User.findAll({});
}

exports.create = (newUser) => {
    return User.create(newUser);
}

exports.delete = (id) => {
    return User.destroy({ where: { id } });
}

exports.update = (data, id) => {
    return User.update(data, { where: { id } });
}

exports.findOne = (id) => {
    return User.findByPk(id);
}

exports.findOneByEmail = (email) => {
    return User.findOne({where: {email: email}});
}