"use strict";
const GradeComment = require('./gradeCommentModel');
const User = require('../users/usersModel');
const sequelize = require('../dal/db');
const { Op } = require("sequelize");

exports.findAllByRecordId = (recordId) => {
    return GradeComment.findAll({
        where: {
            recordId: recordId
        },
        include: User,
        order: [
            ['createdAt', 'DESC']
        ]
    });
}

exports.create = (senderId, recordId, comment) => {
    return GradeComment.create({
        senderId: senderId,
        recordId: recordId,
        comment: comment
    });
}


/*exports.updateOrInsertReview = (data, recordId) => {
    return GradeReview.upsert(data, {
        where: {id: recordId}
    });
}

exports.findOneWithRecordId = (recordId) => {
    return GradeReview.findOne({
        where: {
            recordId: recordId
        }
    });
}

exports.create = (newGradeReview) => {
    return GradeReview.create(newGradeReview);
}

exports.delete = (id) => {
    return GradeReview.destroy({ where: { id: id } });
}

exports.updateOne = async (id, data) => {
    return GradeReview.update(data, {
        where: {
            id: id
        }
    });
}*/