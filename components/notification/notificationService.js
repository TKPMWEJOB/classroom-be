"use strict";
const Notification = require('./notificationModel');
const sequelize = require('../dal/db');

exports.findAll = (userId) => {
    return Notification.findAll({
        where: {
            userId: userId
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });
}

exports.create = (data) => {
    return Notification.create(data);
}

exports.updateOne = (data) => {
    return Notification.update( data, { where: { id: data.id } });
}

exports.delete = (id) => {
    return Notification.destroy({ where: { id: id } });
}

/*exports.updateAll = async (courseId, gradeList) => {
    const result = gradeList.map(async function (obj) {
        await GradeStructure.update({
            title: obj.title,
            point: obj.point,
            index: obj.index
        }, {
            where: {
                id: obj.id,
                courseId: courseId
            }
        });
        return obj;
    });

    return result;

}

exports.updateOne = async (courseId, grade) => {
    return GradeStructure.update({
        title: grade.title,
        point: grade.point,
        index: grade.index
    }, {
        where: {
            id: grade.id,
            courseId: courseId
        }
    });
}

exports.countGradeInCourse = async (courseId) => {
    return GradeStructure.count({
        where: {
            courseId: courseId
        }
    });
}*/