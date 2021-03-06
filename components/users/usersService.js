"use strict";
const User = require('./usersModel');

exports.findAll = () => {
    return User.findAll({});
}

exports.create = (newUser) => {
    /*return UserInfo.create({
        User: newUser
    }, {
        include: [User]
    });*/

    return User.create(newUser);

    /*return sequelize.transaction(async (t) => {
        
        const user = await User.create(
            newUser, 
            { include: [UserInfo] }
        );
        const newData = { userId: user.id };
        await UserInfo.update(
            newData, 
            { where: { id: userInfo.id } }
        );
        return user;
    });*/
}

exports.delete = (id) => {
    return User.destroy({ where: { id } });
}

exports.update = (data, id) => {
    return User.update(data, { where: { id } });
}

exports.findOne = (id) => {
    return User.findOne({ 
        where: { id: id },
        attributes: [
            'id',
            'firstName', 
            'lastName',
            'email',
            'phone', 
            'address',
            'studentID',
            'birthday',
            'school',
            'gender',
            'isMapping',
        ] 
    });
}

exports.findOneByStudentId = (studentId) => {
    return User.findOne({where: {studentID: studentId}});
}

exports.findOneByEmail = (email) => {
    return User.findOne({where: {email}});
}

exports.findOneByEmailV2 = (email) => {
    return User.findOne({where: {email: email}});
}

exports.findOneByUsername = (username) => {
    return User.findOne({where: {username}});
}

exports.findOneByActivateToken = (token) => {
    return User.findOne({where: {activateToken: token}});
}

exports.findOneByResetToken = (token) => {
    return User.findOne({where: {resetPasswordToken: token}});
}