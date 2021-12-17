const StudentRecordsService = require('./studentRecordsService');

exports.index = async (req, res) => {
    res.send(req.params.id);
}

exports.uploadStudentList = async (req, res) => {
    try {
        console.log(req.body);
        const studentList = req.body.data;
        const students = studentList.map(data =>{
            return {
                id: data.studentId,
                fullName: data.fullName,
                courseId: req.params.id
            }
        })
        await StudentRecordsService.resetList(req.params.id);
        await StudentRecordsService.insertList(students);
        res.status(200).send({
            message:
                "Imported successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not import data",
        });
    }
};
