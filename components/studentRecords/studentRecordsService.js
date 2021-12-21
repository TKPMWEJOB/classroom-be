const OfficialStudent = require('./studentRecordsModel').OfficialStudent;
const StudentRecord = require('./studentRecordsModel').StudentRecord;
const GradeStructure = require('../gradeStructure/gradeStructureModel');

exports.insertStudentList = async (studentlist) => {
    return OfficialStudent.bulkCreate(studentlist);
}

exports.updateOrInsertStudent = async (student) => {
    return OfficialStudent.upsert(student, {
        where: {id: student.id, courseId: student.courseId}
    });
}

exports.findIdStudentRecord = async (record) => {
    return StudentRecord.findOne({
        where: {
            courseId: record.courseId,
            studentId: record.studentId,
            gradeId: record.gradeId
        }
    })
}

exports.updateOrInsertStudentRecord = async (record) => {
    return StudentRecord.upsert(record, {
        where: {
            id: record.id,
            courseId: record.courseId,
            studentId: record.studentId,
            gradeId: record.gradeId
        }
    });
}

exports.resetList = async (id) => {
    return OfficialStudent.destroy({
        where: {
            courseId: id
        },
    });
}

exports.insertGradeList = async (gradeList) => {
    return StudentRecord.bulkCreate(gradeList);
}

exports.resetGradeList = async (id) => {
    return StudentRecord.destroy({
        where: {
            courseId: id
        },
    });
}

exports.getList = async (courseId) => {
    return OfficialStudent.findAll({
        where: {courseId: courseId},
        include: [{
            model: StudentRecord,
            attributes: ['point', 'gradeId', 'studentId'],
            include: [{
                model: GradeStructure,
                attributes: ['index'],
            }],
        }],
        attributes: ['id', 'fullName'],
        order: [
            ["id", "ASC"],
            ["StudentRecords", "GradeStructure", 'index', 'ASC'],
        ],
        raw: true,
    });
}

exports.getStudentGrade = async (studentId, courseId) => {
    return OfficialStudent.findAll({
        where: {courseId: courseId},
        include: [{
            model: StudentRecord,
            where: {publish: true, studentId: studentId},
            attributes: ['point', 'gradeId', 'studentId'],
        }],
        attributes: ['id', 'fullName'],
        raw: true,

    });
}

exports.publishStudentRecord = async (courseId, student) => {
    return StudentRecord.update(
        {
            publish: true
        }, {
        where: {
            courseId: courseId,
            studentId: student.studentId,
            gradeId: student.gradeId
        }
    });
}

exports.getStudentList = async (courseId) => {
    return OfficialStudent.findAll({
        where: {courseId: courseId},
    });
}