const StudentRecordsService = require('./studentRecordsService');
const GradesService = require('../gradeStructure/gradeStructureService');

exports.index = async (req, res) => {
    const courseId = req.params.id;
    try {
        const numGrade = await GradesService.countGradeInCourse(courseId);
        const gradesList = await GradesService.findAll(courseId);
        const data = await StudentRecordsService.getList(courseId);
        console.log(data);
/*
        let res = [];
        gradesList.forEach( grade => {
            let row = {
                studentId
            }
        })
*/
        let resArr = [];
        for(let i = 0; i < data.length; i = i + numGrade) {
            resArr.push({
                id: i / numGrade,
                studentId: data[i].id,
                fullName: data[i].fullName,
            });
            let pointList = [];
            for(let j = 0; j < numGrade; j++) {
                pointList.push(data[i + j]["StudentRecords.point"]);
                resArr[i / numGrade][`grade${j}`] = pointList[j];
            }
        }
        res.send(resArr);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving courses."
        });
    }
}

exports.uploadStudentList = async (req, res) => {
    try {
        console.log(req.body);
        const courseId = req.params.id;
        const studentList = req.body.data;
        const gradesList = await GradesService.findAll(courseId);
        const students = studentList.map(data =>{
            return {
                id: data.studentId,
                fullName: data.fullName,
                courseId,
            }
        })
        //await StudentRecordsService.resetList(req.params.id);
        console.log(students);

        await students.forEach(async (student) => {
            await StudentRecordsService.updateOrInsertStudent(student);

            await gradesList.forEach(async (grade) => {
                let studentRecord = { 
                    courseId,
                    gradeId: grade.id,
                    studentId: student.id,
                };

                await StudentRecordsService.updateOrInsertStudentRecord(studentRecord);
            })
        });


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
