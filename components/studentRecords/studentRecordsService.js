const OfficialStudent = require('./studentRecordsModel').OfficialStudent;

exports.insertList = async (studentlist) => {
    return OfficialStudent.bulkCreate(studentlist);
}

exports.resetList = async (id) => {
    return OfficialStudent.destroy({
        where: {
            courseId: id
        },
    });
}