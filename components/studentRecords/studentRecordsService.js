const OfficialStudent = require('./studentRecordsModel').OfficialStudent;
const StudentRecord = require('./studentRecordsModel').StudentRecord;

exports.insertStudentList = async (studentlist) => {
    return OfficialStudent.bulkCreate(studentlist);
}

exports.resetStudentList = async (id) => {
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