const OfficialStudent = require('./studentRecordsModel').OfficialStudent;
const StudentRecord = require('./studentRecordsModel').StudentRecord;

exports.insertStudentList = async (studentlist) => {
    return OfficialStudent.bulkCreate(studentlist);
}

exports.updateOrInsertStudent = async (student) => {
    return OfficialStudent.upsert(student, {
        where: {id: student.id, courseId: student.courseId}
    });
}

exports.updateOrInsertStudentRecord = async (record) => {
    return StudentRecord.findOrCreate({
        where: {...record}
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
        }],
        attributes: ['id', 'fullName'],
        raw: true,

    });
}