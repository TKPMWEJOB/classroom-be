"use strict";
const User = require('./usersModel');
const UserInfo = require('./usersInfoModel');

exports.findAll = () => {
    return User.findAll({});
}

exports.create = (newUser) => {
    return sequelize.transaction(async (t) => {
        const userInfo = await UserInfo.create({ transaction: t });
        const user = await User.create(newUser, { transaction: t });
        const newData = { userId: user.id };
        await UserInfo.update(newData, { where: { id: userInfo.id } });
        return user;
    });
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
    return User.update(data, { where: { id: id } });
}

exports.updateInfo = (data, id) => {
    return UserInfo.update(data, { where: { userId: id } });
}

exports.findOne = (id) => {
    return User.findOne({ 
        where: { id: id },
        include: [{ model: UserInfo, attributes: [
            'phone', 
            'address',
            'studentID',
            'birthday',
            'school',
            'gender'
        ] }],
        attributes: [
            'id',
            'firstName', 
            'lastName',
            'email'
        ] 
    });
}

/*exports.findOneInfo = (id) => {
    return User.findOne({ where: { userId: id } });
}*/

exports.findOneByEmail = (email) => {
    return User.findOne({where: {email: email}});
}