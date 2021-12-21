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
            let total = 0;
            for(let j = 0; j < numGrade; j++) {
                pointList.push(data[i + j]["StudentRecords.point"]);
                resArr[i / numGrade][`grade${j}`] = pointList[j];
                total += pointList[j];
            }
            resArr[i / numGrade]['total'] = total;
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
        });
        await students.forEach(async (student) => {
            console.log(student);
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

exports.uploadFullGrade = async (req, res) => {
    try {
        const studentList = req.body.data;
        const courseId = req.params.id;
        //await StudentRecordsService.resetGradeList(courseId);
        await studentList.forEach(async (student) => {
            const newStudent = {
                id: student.studentId,
                fullName: student.fullName,
                courseId,
            }   
            await StudentRecordsService.updateOrInsertStudent(newStudent);
            await student.gradesPoint.forEach(async (grade) => {
                let studentRecord = { 
                    courseId,
                    gradeId: grade.gradeId,
                    studentId: student.studentId,
                    point: grade.point
                };
                await StudentRecordsService.updateOrInsertStudentRecord(studentRecord);
            })
        });

        

        /*const students = data.map(item => {
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
        await StudentRecordsService.insertGradeList(studentRecords);*/

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

exports.updateOneRow = async (req, res) => {
    try {
        const student = req.body.data;
        const courseId = req.params.id;
        const gradesList = await GradesService.findAll(courseId);
        
        await gradesList.forEach(async (grade, index) => {
            let saveRow = {
                studentId: student.studentId,
                point: student[`grade${index}`],
                courseId,
                gradeId: grade.id,
            }
            const record = await StudentRecordsService.findIdStudentRecord(saveRow);
            saveRow.id = record.id;
            await StudentRecordsService.updateOrInsertStudentRecord(saveRow);
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

exports.publishGrade = async (req, res) => {
    try {
        const student = req.body.data;
        const courseId = req.params.id;
        
        await StudentRecordsService.publishStudentRecord(courseId, student);

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
