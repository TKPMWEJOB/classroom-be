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
        await StudentRecordsService.resetStudentList(req.params.id);
        await StudentRecordsService.insertStudentList(students);
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

exports.uploadFullGrade = async (req, res) => {
    try {
        console.log(req.body);
        const data = req.body.data;
        const students = data.map(item => {
            return {
                id: item.studentId,
                fullName: item.fullName,
                courseId: req.params.id                
            }
        });

        let studentRecords = [];
        Object.keys(data).forEach(studentKey => {
            let newStudent = {
                studentId: data[studentKey].studentId,
                courseId: req.params.id
            }

            const newRows = data[studentKey].gradesPoint.map(grade => {
                return {
                    studentId: newStudent.studentId,
                    courseId: newStudent.courseId,
                    gradeId: grade.gradeId,
                    point: grade.point
                }
            });

            studentRecords = studentRecords.concat(newRows);
        });

        console.log(studentRecords);

        await StudentRecordsService.resetStudentList(req.params.id);
        await StudentRecordsService.insertStudentList(students);
        await StudentRecordsService.resetGradeList(req.params.id);
        await StudentRecordsService.insertGradeList(studentRecords);

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
