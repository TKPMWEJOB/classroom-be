const StudentRecordsService = require('./studentRecordsService');
const usersService = require('../users/usersService');
const GradesService = require('../gradeStructure/gradeStructureService');
const UserService = require('../users/usersService');
const NotificationsController = require('../notification/notificationController');
const jwtDecode = require('jwt-decode');
const Permission = require('../auth/rolePermission');

exports.index = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const courseId = req.params.id;
    const gradesList = await GradesService.findAll(courseId);
    const numGrade = gradesList.length;
    let data = [];
    try {
        const role = await Permission.getRole(parsedToken.user.id, courseId);
        if (role != 'teacher' && role != 'owner' && role != 'student') {
            res.status(500).send({
                message: 'Forbbiden'
            });
        }
        else if (role != 'teacher' && role != 'owner') {
            const student = await usersService.findOne(parsedToken.user.id);
            data = await StudentRecordsService.getStudentGrade(student.studentID, courseId);
            let resArr = [];
            for (let i = 0; i < data.length; i = i + numGrade) {
                resArr.push({
                    id: i / numGrade,
                    studentId: data[i].id,
                    fullName: data[i].fullName,
                });
                let pointList = [];
                let total = 0;
                for (let j = 0; j < numGrade; j++) {
                    try {
                        pointList.push(data[i + j]["StudentRecords.point"]);
                        resArr[i / numGrade][`grade${j}`] = pointList[j];
                        total += pointList[j];
                    }
                    catch {
                        resArr[i / numGrade][`grade${j}`] = null;
                    }
                }
                resArr[i / numGrade]['total'] = total;
            }
            res.send(resArr);
        }
        else {
            data = await StudentRecordsService.getList(courseId);
            console.log(data);
            let resArr = [];
            for (let i = 0; i < data.length; i = i + numGrade) {
                let userInfo = await UserService.findOneByStudentId(data[i].id);
                resArr.push({
                    id: i / numGrade,
                    fullName: data[i].fullName,
                    studentId: data[i].id,
                    userId: userInfo ? userInfo.id : null,
                });
                let pointList = [];
                let total = 0;
                for (let j = 0; j < numGrade; j++) {
                    try {
                        pointList.push(data[i + j]["StudentRecords.point"]);
                        resArr[i / numGrade][`grade${j}`] = pointList[j];
                        total += pointList[j];
                    }
                    catch {
                        resArr[i / numGrade][`grade${j}`] = null;
                    }
                }
                resArr[i / numGrade]['total'] = total;
            }

            res.send(resArr);
        }

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
        const students = studentList.map(data => {
            return {
                id: data.studentId,
                fullName: data.fullName,
                courseId,
            }
        });
        await Promise.all(students.map(async (student) => {
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
        }));

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
        console.log(studentList);
        await Promise.all(studentList.map(async (student) => {
            const newStudent = {
                id: student.studentId,
                courseId
            }
            await StudentRecordsService.updateOrInsertStudent(newStudent);
            await student.gradesPoint.forEach(async (grade) => {
                if (grade != null) {
                    let studentRecord = {
                        courseId,
                        gradeId: grade.gradeId,
                        studentId: student.studentId,
                        point: grade.point
                    };
                    const record = await StudentRecordsService.findIdStudentRecord(studentRecord);
                    if (record) {
                        studentRecord.id = record.id;
                    }
                    await StudentRecordsService.updateOrInsertStudentRecord(studentRecord);
                }
            })
        }));

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
                point: student[`grade${index}`] === "" ? null : student[`grade${index}`],
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


//////////////////////Publish//////////////////////////

exports.publishOneGrade = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    try {
        const gradeInfor = req.body.data;
        const courseId = req.params.id;

        // publish grade
        await StudentRecordsService.publishOneRecord(courseId, gradeInfor);

        // create notification
        await NotificationsController.createOneGradeNotification(parsedToken.user.id, gradeInfor.studentId, courseId);

        res.status(200).send({
            message:
                "Publish successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not publish",
        });
    }
};

exports.publishOneRow = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    try {
        const studentId = req.body.data.studentId;
        const courseId = req.params.id;

        await StudentRecordsService.publishOneStudent(courseId, studentId);

        // create notification
        await NotificationsController.createOneStudentGradeNotification(parsedToken.user.id, studentId, courseId);

        res.status(200).send({
            message:
                "Publish successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not publish",
        });
    }
};

exports.publishOneColumn = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    try {
        const gradeId = req.body.data.gradeId;
        const courseId = req.params.id;

        await StudentRecordsService.publishOneGrade(courseId, gradeId);

        //create notification
        await NotificationsController.createManyGradeNotification(parsedToken.user.id, gradeId, courseId);

        res.status(200).send({
            message:
                "Publish successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not publish",
        });
    }
};

exports.publishAllRecords = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    try {
        const courseId = req.params.id;

        await StudentRecordsService.publishAllRecords(courseId);

        //Create notification
        await NotificationsController.createManyStudentGradeNotification(parsedToken.user.id, courseId)

        res.status(200).send({
            message:
                "Publish successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not publish",
        });
    }
};
