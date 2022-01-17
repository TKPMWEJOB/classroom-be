"use strict";
const gradeReviewService = require('./gradeReviewService');
const StudentRecordsService = require('../studentRecords/studentRecordsService');
const jwtDecode = require('jwt-decode');
const Permission = require('../auth/rolePermission');

/*exports.createOne = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    const userId = parsedToken.user.id;
  
    const notification = {
      title: req.body.title,
      content: req.body.content,
      status: 'waiting',
      senderId: userId,
      userId: req.body.receiverId
    }
  
    try {
      const result = await notificationService.create(notification);
      if (result) {
          res.send(result);
      } 
      else {
        res.status(500).send({
          message: err.message || "Some error occurred while sending notifications."
        });
      }
    } 
    catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while sending notifications."
      });
    }
  };*/
  
exports.createOneReview = async (courseId, studentId, gradeId) => {
    try {
      //find record
      const record = await StudentRecordsService.findOneRecordWithFullInfor(courseId, studentId, gradeId);
      if (record) {
        // update or insert review  
        const newReview = {
          id: record.id,
          recordId: record.id
        }
        const result = await gradeReviewService.updateOrInsertReview(newReview);
        return result;
      }
      else {
        return null;
      }
    } 
    catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while creating review."
      });
    }
  };
  
  exports.createRowReviews = async (courseId, studentId) => {
    try {
      const recordList = await StudentRecordsService.findAllRecordOfOneStudent(courseId, studentId);
      if (recordList) {
        await recordList.forEach(async (record) => {
          await this.createOneReview(courseId, studentId, record.gradeId);
        });
      }
    } 
    catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while sending notifications."
      });
    }
  };
  
  exports.createColReviews = async (courseId, gradeId) => {
    try {
      const studentList = await StudentRecordsService.findAllOfficialStudentInCourse(courseId);
      if (studentList) {
        await studentList.forEach(async (student) => {
          await this.createOneReview(courseId, student.id, gradeId);
        });
      }
    } 
    catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while sending notifications."
      });
    }
  };
  
  exports.createAllReviews = async (courseId) => {
    try {
      // create notification
      const recordList = await StudentRecordsService.findAll(courseId);
      if (recordList) {
        await recordList.forEach(async (record) => {
          await this.createOneReview(courseId, record.studentId, record.gradeId);
        });
      }
    } 
    catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while sending notifications."
      });
    }
  };
  
  exports.updateViewedStatus = async (req, res) => {
    const newStatus = {
      status: 'viewed'
    }
  
    try {
      let result = await notificationService.updateOne(newStatus, req.body.data.notificationId);
      if (result) {
          result = await this.index(req, res);
          res.send(result);
      } 
      else {
        res.status(500).send({
          message: err.message || "Some error occurred while updating notifications."
        });
      }
    } 
    catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while updating notifications."
      });
    }
  };
