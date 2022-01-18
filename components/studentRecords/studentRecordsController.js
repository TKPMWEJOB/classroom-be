const StudentRecordsService = require('./studentRecordsService');
const usersService = require('../users/usersService');
const GradesService = require('../gradeStructure/gradeStructureService');
const UserService = require('../users/usersService');
const NotificationsController = require('../notification/notificationController');
const GradeReviewController = require('../gradeReview/gradeReviewController');
const gradeCommentController = require('../gradeComment/gradeCommentController');
const gradeCommentService = require('../gradeComment/gradeCommentService');
const GradeReviewService = require('../gradeReview/gradeReviewService');
const coursesService = require('../courses/coursesService');
const jwtDecode = require('jwt-decode');
const Permission = require('../auth/rolePermission');
const e = require('express');

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
            result = {
                draftData: data,
                resData: resArr
            }
            res.send(result);
        }
        else {
            data = await StudentRecordsService.getList(courseId);
            //console.log(data);
            let resArr = [];
            for (let i = 0; i < data.length; i = i + numGrade) {
                let userInfo = await UserService.findOneByStudentId(data[i].id);
                console.log(userInfo);
                resArr.push({
                    id: i / numGrade,
                    fullName: data[i].fullName,
                    studentId: data[i].id,
                    userId: userInfo ? userInfo.id : null,
                    isMapping: userInfo?.isMapping,
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
            //console.log(resArr);
            result = {
                draftData: data,
                resData: resArr
            }
            res.send(result);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving courses."
        });
    }
}

exports.findOneRecord = async (req, res) => { 
    const gradeId = req.params.gradeid;
    const courseId = req.params.id;
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;

    try {
        const user = await usersService.findOne(userId);
        const record = await StudentRecordsService.findOnePublish(courseId, user.studentID, gradeId);
        if (record) {
            res.send(record);
        }
        else {
            res.send(null);
        }
        
    } catch (err) {
        res.status(500).send(null);
    }
}

exports.findGradeRecord = async (req, res) => { 
    const gradeId = req.params.gradeid;
    const courseId = req.params.id;

    try {
        const recordList = await StudentRecordsService.findGradeRecordReview(courseId, gradeId);

        if (recordList) {
            res.send(recordList);
        }
        else {
            res.send(null);
        }
        
    } catch (err) {
        res.status(500).send(null);
    }
}

///////////////////Upload////////////////
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

        // create grade review draft
        await GradeReviewController.createOneReview(courseId, gradeInfor.studentId, gradeInfor.gradeId);

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

        // publish student
        await StudentRecordsService.publishOneStudent(courseId, studentId);

        // create notification
        await NotificationsController.createOneStudentGradeNotification(parsedToken.user.id, studentId, courseId);

        // create grade review draft
        await GradeReviewController.createRowReviews(courseId, studentId);

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

        //create grade review draft
        await GradeReviewController.createColReviews(courseId, gradeId);

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
        await NotificationsController.createManyStudentGradeNotification(parsedToken.user.id, courseId);

        //create grade review draft
        await GradeReviewController.createAllReviews(courseId);


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

// grade review

exports.requestReview = async (req, res) => {
    const gradeId = req.params.gradeid;
    const courseId = req.params.id;
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;
    let data = req.body;
    data.status = "requesting";
    try {
        const user = await usersService.findOne(userId);
        const record = await StudentRecordsService.findOnePublish(courseId, user.studentID, gradeId);
        if (record) {
            const result = await GradeReviewService.updateOne(record.id, data);
            if (result) {
                const course = await coursesService.findOne(courseId);
                await NotificationsController.createGradeReviewRequestNotification(userId, course.ownerId, courseId);
                res.status(200).send({
                    message:
                        "Request successfully",
                });
            }
        }
        else {
            res.status(500).send({
                message: "Could not send request",
            });
        }
        
    } catch (err) {
        res.status(500).send({
            message: "Could not send request",
        });
    }
};

exports.acceptReview = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;
    const recordId = req.body.recordId;
    const studentId = req.body.studentId;
    const courseId = req.params.id;
    const gradeId = req.params.gradeid;
    const newPoint = {
        point: req.body.point
    }
    const data = {
        resolveComment: req.body.resolveComment,
        status: 'accept'
    }
    try {
        await StudentRecordsService.updateOneWithId(newPoint, recordId);
        const result = await GradeReviewService.updateOne(recordId, data);
        if (result) {
            //const course = await coursesService.findOne(courseId);
            await NotificationsController.createGradeAcceptRequestNotification(userId, studentId, courseId, newPoint.point, gradeId);
            await gradeCommentService.create(userId, studentId, recordId, data.resolveComment);
            await this.findGradeRecord(req, res);
        }
        
    } catch (err) {
        res.status(500).send({
            message: "Could not send acception",
        });
    }
};

exports.rejectReview = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;
    const recordId = req.body.recordId;
    const studentId = req.body.studentId;
    const courseId = req.params.id;
    const data = {
        resolveComment: req.body.resolveComment,
        status: 'reject'
    }
    try {
        const result = await GradeReviewService.updateOne(recordId, data);
        if (result) {
            //const course = await coursesService.findOne(courseId);
            await NotificationsController.createGradeRejectRequestNotification(userId, studentId, courseId);
            await gradeCommentService.create(userId, studentId, recordId, data.resolveComment);
            await this.findGradeRecord(req, res);
        }
        
    } catch (err) {
        res.status(500).send({
            message: "Could not send rejection",
        });
    }
};


////////Comment///////

exports.findStudentComment = async (req, res) => { 
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;

    const gradeId = req.params.gradeid;
    const courseId = req.params.id;

    try {
        const user = await usersService.findOne(userId);
        const record = await StudentRecordsService.findOneByIdInfor(courseId, user.studentID, gradeId);
        console.log(record.id);
        const commentList = await gradeCommentService.findAllByRecordId(record.id);
        if (commentList) {
            res.send(commentList);
        }
        else {
            res.send(null);
        }
        
    } catch (err) {
        res.status(500).send(null);
    }
}

/*exports.findTeacherComment = async (req, res) => { 

    const gradeId = req.params.gradeid;
    const courseId = req.params.id;

    try {
        const recordList = await StudentRecordsService.findGradeRecordReview(courseId, gradeId);
        if (recordList) {
            
            res.send(recordList);
        }
        else {
            res.send(null);
        }
        
    } catch (err) {
        res.status(500).send(null);
    }
}*/


exports.studentComment = async (req, res) => {
    const gradeId = req.params.gradeid;
    const courseId = req.params.id;
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;
    const comment = req.body.comment;

    try {
        const user = await usersService.findOne(userId);
        const record = await StudentRecordsService.findOneByIdInfor(courseId, user.studentID, gradeId);
        await gradeCommentService.create(userId, record.id, comment);
        await this.findStudentComment(req, res);
    } catch (err) {
        res.status(500).send({
            message: "Could not send request",
        });
    }
};

exports.teacherComment = async (req, res) => {
    //const gradeId = req.params.gradeid;
    //const courseId = req.params.id;
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;
    const comment = req.body.comment;
    //const studentId = req.body.studentId;
    const recordId = req.body.recordId;

    try {
        await gradeCommentService.create(userId, recordId, comment);
        res.status(200).send({
            message:
                "Comment successfully",
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not send request",
        });
    }
};