const OfficialStudent = require('./studentRecordsModel').OfficialStudent;

exports.insertList = async (studentlist) => {
    return OfficialStudent.bulkCreate(studentlist);
}

exports.resetList = async () => {
    return OfficialStudent.destroy({
        where: {},
    });
}