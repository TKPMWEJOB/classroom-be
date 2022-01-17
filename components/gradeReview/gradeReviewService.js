"use strict";
const GradeReview = require('./gradeReviewModel');
const sequelize = require('../dal/db');

/*exports.findAll = (courseId) => {
    return GradeStructure.findAll({
        where: {
            courseId: courseId
        },
        order: [
            ['index', 'ASC']
        ],
        attributes: ['id', 'title', 'point', 'index']
    });
}*/
exports.updateOrInsertReview = (data, recordId) => {
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
    return GradeStructure.update(data, {
        where: {
            id: id
        }
    });
}