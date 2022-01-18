"use strict";
const Notification = require('./notificationModel');
const { Op } = require("sequelize");

exports.findAll = (userId, studentId) => {
    console.log(userId);
    console.log(studentId);
    return Notification.findAll({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { receiverRole: 'student' },
                        { receiverId: studentId}
                    ]
                },
                {
                    [Op.and]: [
                        { receiverRole: 'teacher' },
                        { receiverId: userId}
                    ]
                }
            ]
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });
}

exports.create = (data) => {
    return Notification.create(data);
}

exports.updateOne = (data, id) => {
    return Notification.update( data, { where: { id: id } });
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