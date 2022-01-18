"use strict";
const usersService = require('./usersService');
const coursesService = require('../courses/coursesService');
const jwtDecode = require('jwt-decode');
const { Course } = require('../courses/coursesModel');

exports.index = async (req, res) => {
    try {
        const data = await usersService.findAll();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const num = await usersService.delete(req.params.id)
        if (num == 1) {
            res.send({
                message: "User was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting the user."
        });
    }
};


exports.updateNameId = async (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentID: req.body.studentID,
        isMapping: req.body.isMapping,
    };

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const duplicateUser = await usersService.findOneByStudentId(user.studentID);
        if (duplicateUser !== null && duplicateUser.dataValues.id !== req.body.id) {
            res.status(409).send({
                msg: "This Student ID is already exist!"
            });
        } else {
            try {
                const num = await usersService.update(user, req.body.id);
        
                if (num) {
                    this.findUpdatedNewData(req, res);
                } else {
                    res.status(404).send({
                        msg: 'User not found'
                    });
                }
            } catch (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while updating the user."
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg:
                err.message || "Some error occurred while creating account."
        });
    };
};

exports.updateInfo = async (req, res) => {
    const user = {
        birthday: req.body.date,
        gender: req.body.gender,
        address: req.body.address,
        phone: req.body.phone,
        school: req.body.school,
    };

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const num = await usersService.update(user, req.body.id);
        if (num) {
            this.findUpdatedNewData(req, res);
        } else {
            res.status(404).send({
                msg: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the user."
        });
    }
};

exports.findOne = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    try {
        const data = await usersService.findOne(parsedToken.user.id);
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the user."
        });
    }
};

exports.findUserInCourse = async (req, res) => {
    const token = req.cookies.token;
    let userId = null;
    if (token) {
        const parsedToken = jwtDecode(token);
        userId = parsedToken.user.id;
    }
    const invitationId = req.params.id;


    try {
        /*const invitation = await coursesService.findOneInvitationByCode(invitationId);
        let course = null;
        if (invitation) {
            course = await coursesService.findOne(invitation.courseId);
        }
        else {
            course = await coursesService.findOne(invitationId);
        }*/

        if (invitationId.length === 8) {
            course = await coursesService.findOne(invitationId);
            if (course !== null) {
                if (userId !== null) {
                    const student = await coursesService.findOneStudent(course.id, userId);
                    const teacher = await coursesService.findOneTeacher(course.id, userId);
                    const user = await usersService.findOne(userId);
                    
                    if (student === null && teacher === null && user !== null) {
                        res.status(201).send(user);
                    } else if (user === null){
                        res.status(203).send({
                            message: 'User not found'
                        });
                    } else {
                        res.status(202).send(course);
                    }
                }
                else {
                    res.status(203).send({
                        message: 'User not found'
                    });
                }
            }
            else {
                res.status(500).send({
                    message: err.message || "Some error occurred while finding the course."
                });
            }
        }   
        else if (invitationId.length === 12) {
            const invitation = await coursesService.findOneInvitationByCode(invitationId);
            if (invitation) {
                if (userId !== null) {
                    //const student = await coursesService.findOneStudent(course.id, userId);
                    const teacher = await coursesService.findOneTeacher(invitation.courseId, userId);
                    const user = await usersService.findOne(userId);

                    if(user.email === invitation.email) {
                        if (teacher === null && user !== null) {
                            res.status(201).send(user);
                        } else if (user === null){
                            res.status(203).send({
                                message: 'User not found'
                            });
                        } else {
                            res.status(202).send(course);
                        }
                    }
                    else {
                        res.status(204).send({
                            message: 'Not permission'
                        });
                    }
                }
                else {
                    res.status(203).send({
                        message: 'User not found'
                    });
                }
            }
        }
        else {

        }
        
        
        
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the user."
        });
    }
};

exports.findUpdatedNewData = async (req, res) => {
    try {
        const data = await usersService.findOne(req.body.id);
        if (data) {
            data.dataValues.msg = "Update Successfully!";
            console.log(data);
            res.send(data);
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the user."
        });
    }
};

exports.findOneOtherUser = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    try {
        const data = await usersService.findOne(req.params.id);
        if (!data.isMapping)
        {
            res.status(403).send({
                message: 'You are not allow!'
            });
            return;
        }
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: 'User not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the user."
        });
    }
};

exports.findUserWithStudentId = async (req, res) => {
    const token = req.cookies.token;
    try {
        const data = await usersService.findOneByStudentId(req.params.studentId);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the user."
        });
    }
};
