"use strict";
const GradeStructure = require('./gradeStructureModel');
const sequelize = require('../dal/db');

exports.findAll = (courseId) => {
    return GradeStructure.findAll({
        where: {
            courseId: courseId
        },
        order: [
            ['index', 'ASC']
        ],
        attributes: ['id', 'title', 'point', 'index']
    });
}

exports.create = (newGrade) => {
    return GradeStructure.create(newGrade);
}

exports.delete = (courseId, gradeStructureId) => {
    return GradeStructure.destroy({ where: { id: gradeStructureId, courseId: courseId } });
}

exports.updateAll = async (courseId, gradeList) => {


    /*const newGradeStructure = tempStructure.map(function(obj) { 
        obj.index = index; 
        index++;
        return obj;
    });*/

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