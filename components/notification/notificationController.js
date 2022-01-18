"use strict";
const notificationService = require('./notificationService');
const studentRecordsService = require('../studentRecords/studentRecordsService');
const coursesService = require('../courses/coursesService');
const usersService = require('../users/usersService');
const jwtDecode = require('jwt-decode');
const GradeStructure = require('../gradeStructure/gradeStructureModel');
const GradeStructureService = require('../gradeStructure/gradeStructureService');

exports.index = async (req, res) => {
  const token = req.cookies.token;
  const parsedToken = jwtDecode(token);
  const userId = parsedToken.user.id;
  try {
    const userInfor = await usersService.findOne(userId);
    const data = await notificationService.findAll(userId, userInfor.studentID);
    //console.log(data);
    if (data) {
        res.send(data);
    } else {
        res.status(200).send({
            message: 'Notification not found'
        });
    }
  } catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while finding notifications."
      });
  }
};

exports.createOne = async (req, res) => {
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
};

exports.createOneGradeNotification = async (senderId, receiverId, courseId) => {
  try {
    // create notification
    const course = await coursesService.findOne(courseId);
    const sender = await usersService.findOne(senderId);

    const notification = {
        senderId: senderId,
        receiverId: receiverId,
        receiverRole: `student`,
        title: `New publish grade in ${course.name}`,
        content: `You receive a new published grade from ${sender.lastName} ${sender.firstName} in ${course.name}.`,
        status: 'waiting'
    }

    const result = await notificationService.create(notification);
    return result;
  } 
  catch (err) {
    res.status(500).send({
        message: err.message || "Some error occurred while sending notifications."
    });
  }
};

exports.createManyGradeNotification = async (senderId, gradeId, courseId) => {
  try {
    // create notification
    const studentList = await studentRecordsService.findAllRecordByGradeId(courseId, gradeId);

    await studentList.forEach(async (student) => {
      if (student.point) {
        await this.createOneGradeNotification(senderId, student.studentId, courseId);
      }
    });
  } 
  catch (err) {
    res.status(500).send({
        message: err.message || "Some error occurred while sending notifications."
    });
  }
};

exports.createOneStudentGradeNotification = async (senderId, receiverId, courseId) => {
  try {
    // create notification
    const course = await coursesService.findOne(courseId);

    const notification = {
        senderId: senderId,
        receiverId: receiverId,
        receiverRole: `student`,
        title: `New publish grades in ${course.name}`,
        content: `Your result in ${course.name} have been published.`,
        status: 'waiting'
    }

    const result = await notificationService.create(notification);
    return result;
  } 
  catch (err) {
    res.status(500).send({
        message: err.message || "Some error occurred while sending notifications."
    });
  }
};

exports.createManyStudentGradeNotification = async (senderId, courseId) => {
  try {
    // create notification
    const studentList = await studentRecordsService.findAllOfficialStudentInCourse(courseId);

    await studentList.forEach(async (student) => {
      await this.createOneStudentGradeNotification(senderId, student.id, courseId);
    });
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

exports.createGradeReviewRequestNotification = async (senderId, receiverId, courseId) => {
  try {
    // create notification
    const course = await coursesService.findOne(courseId);
    const sender = await usersService.findOne(senderId);

    const notification = {
        senderId: senderId,
        receiverId: receiverId,
        receiverRole: `teacher`,
        title: `New grade review request in ${course.name}`,
        content: `You receive a new grade review request from ${sender.lastName} ${sender.firstName} in ${course.name}.`,
        status: 'waiting'
    }

    const result = await notificationService.create(notification);
    return result;
  } 
  catch (err) {
    res.status(500).send({
        message: err.message || "Some error occurred while sending notifications."
    });
  }
};

exports.createGradeRejectRequestNotification = async (senderId, receiverId, courseId) => {
  try {
    // create notification
    const course = await coursesService.findOne(courseId);

    const notification = {
        senderId: senderId,
        receiverId: receiverId,
        receiverRole: `student`,
        title: `New notification from ${course.name}`,
        content: `Your request to review grade in ${course.name} has been accept.`,
        status: 'waiting'
    }

    const result = await notificationService.create(notification);
    return result;
  } 
  catch (err) {
    res.status(500).send({
        message: err.message || "Some error occurred while sending notifications."
    });
  }
};

exports.createGradeAcceptRequestNotification = async (senderId, receiverId, courseId, point, gradeId) => {
  try {
    // create notification
    const course = await coursesService.findOne(courseId);
    const grade = await GradeStructureService.findOneWithGradeId(gradeId);
    
    const notification = {
        senderId: senderId,
        receiverId: receiverId,
        receiverRole: `student`,
        title: `New notification from ${course.name}`,
        content: `Your request to review grade in ${course.name} has been accepted. Your new point of ${grade.title} (${grade.point}) is ${point}`,
        status: 'waiting'
    }

    const result = await notificationService.create(notification);
    return result;
  } 
  catch (err) {
    res.status(500).send({
        message: err.message || "Some error occurred while sending notifications."
    });
  }
};


