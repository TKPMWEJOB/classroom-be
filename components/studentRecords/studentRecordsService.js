const OfficialStudent = require('./studentRecordsModel').OfficialStudent;
const StudentRecord = require('./studentRecordsModel').StudentRecord;
const GradeStructure = require('../gradeStructure/gradeStructureModel');
const GradeReview = require('../gradeReview/gradeReviewModel');
const { Op } = require("sequelize");

exports.findAll = async (courseId) => {
    return StudentRecord.findAll({
        where: {
            courseId: courseId
        }
    })
}

exports.insertStudentList = async (studentlist) => {
    return OfficialStudent.bulkCreate(studentlist);
}

exports.updateOrInsertStudent = async (student) => {
    return OfficialStudent.upsert(student, {
        where: {id: student.id, courseId: student.courseId}
    });
}

exports.findOne = async (recordId) => {
    return StudentRecord.findOne({
        where: {
            id: recordId
        }
    })
}

exports.findOnePublish = async (courseId, studentId, gradeId) => {
    return StudentRecord.findOne({
        where: {
            courseId: courseId,
            studentId: studentId,
            gradeId: gradeId,
            publish: true
        }
    })
}

exports.findGradeRecordReview = async (courseId, gradeId) => {
    return StudentRecord.findAll({
        where: {
            courseId: courseId,
            gradeId: gradeId,
        },
        include: GradeReview,
        order: [
            ['studentId', 'ASC'],
        ],
    })
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

exports.findOneRecordWithFullInfor = async (courseId, studentId, gradeId) => {
    return StudentRecord.findOne({
        where: {
            courseId: courseId,
            studentId: studentId,
            gradeId: gradeId
        }
    })
}

exports.findAllRecordByGradeId = async (courseId, gradeId) => {
    return StudentRecord.findAll({
        where: {
            courseId: courseId,
            gradeId: gradeId
        }
    })
}

exports.findAllOfficialStudentInCourse = async (courseId) => {
    return OfficialStudent.findAll({
        where: {
            courseId: courseId
        }
    })
}

exports.findAllRecordOfOneStudent = async (courseId, studentId) => {
    return StudentRecord.findAll({
        where: {
            courseId: courseId,
            studentId: studentId
        }
    })
}

exports.updateOrInsertStudentRecord = async (record) => {
    return StudentRecord.upsert(record, {
        where: {
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
            attributes: ['point', 'gradeId', 'studentId', 'publish'],
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

exports.publishOneRecord = async (courseId, gradeInfor) => {
    return StudentRecord.update(
        {
            publish: true,
            publishedDate: Date.now()
        }, {
        where: {
            courseId: courseId,
            studentId: gradeInfor.studentId,
            gradeId: gradeInfor.gradeId,
            publish: false,
            point: {
                [Op.not]: null
            }
        }
    });
}

exports.publishOneStudent = async (courseId, studentId) => {
    return StudentRecord.update(
        {
            publish: true,
            publishedDate: Date.now()
        }, {
        where: {
            courseId: courseId,
            studentId: studentId,
            publish: false,
            point: {
                [Op.not]: null
            }
        }
    });
}

exports.publishOneGrade = async (courseId, gradeId) => {
    return StudentRecord.update(
        {
            publish: true,
            publishedDate: Date.now()
        }, {
        where: {
            courseId: courseId,
            gradeId: gradeId,
            publish: false,
            point: {
                [Op.not]: null
            }
        }
    });
}

exports.publishAllRecords = async (courseId) => {
    return StudentRecord.update(
        {
            publish: true,
            publishedDate: Date.now()
        }, {
        where: {
            courseId: courseId,
            publish: false,
            point: {
                [Op.not]: null
            }
        }
    });
}

exports.getStudentList = async (courseId) => {
    return OfficialStudent.findAll({
        where: {courseId: courseId},
    });
}