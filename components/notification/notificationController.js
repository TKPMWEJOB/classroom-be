"use strict";
const notificationService = require('./notificationService');
const jwtDecode = require('jwt-decode');

exports.index = async (req, res) => {
  const token = req.cookies.token;
  const parsedToken = jwtDecode(token);
  const userId = parsedToken.user.id;
  try {
    const data = await notificationService.findAll(userId);
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

exports.updateStatus = async (req, res) => {
  const newStatus = {
    status: req.body.status
  }

  try {
    const result = await notificationService.updateOne(newStatus, req.params.id);
    if (result) {
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



