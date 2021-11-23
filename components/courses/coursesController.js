"use strict";
const CoursesService = require('./coursesService');
const UsersService = require('../users/usersService');
const jwtDecode = require('jwt-decode');
const referralCodes = require('referral-codes');
const nodemailer = require('nodemailer');

exports.index = async (req, res) => {
    try {
        const data = await CoursesService.findAll();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving courses."
        });
    }
};

exports.create = async (req, res) => {
    const token = req.headers.authorization;
    const parsedToken = jwtDecode(token);
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    let isGenerated = false;
    let invitationCode = '';
    while(!isGenerated) {
        const code = referralCodes.generate({
            length: 8
        });

        invitationCode = code[0];

        try {
            const data = await CoursesService.findOneByInvitationId(invitationCode);
            if (data === null) {
                isGenerated = true;
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the course."
            });
        };      
    }


    const course = {
        name: req.body.name,
	    ownerId: parsedToken.user.id,
        section: req.body.section,
        subject: req.body.subject,
        room: req.body.room,
        invitationId: invitationCode
    };


    try {
        const data = await CoursesService.create(course);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the course."
        });
    };
};

exports.delete = async (req, res) => {
    const token = req.headers.authorization;
    const parsedToken = jwtDecode(token);
    try {
        const num = await CoursesService.delete(req.params.id, parsedToken.user.id)
        if (num == 1) {
            res.send({
                message: "Course was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: 'Course not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting the course."
        });
    }
};

exports.update = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const num = await CoursesService.update(req.body, req.params.id);
        if (num == 1) {
            this.findOne(req, res);
        } else {
            res.status(404).send({
                message: 'Course not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the course."
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        const data = await CoursesService.findOne(req.params.id);
        if (data !== null) {
            console.log(data);
            res.send(data);
        } else {
            res.status(404).send({
                message: 'Course not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while finding the course."
        });
    }
};

exports.inviteStudent = async (req, res) => {
    const invitationLink = req.body.invitationLink;
    const courseId = req.body.courseId;
    const emailReceiver = req.body.emailReceiver;
    const emailSender = req.body.emailSender;
    const sender = req.body.sender;

    //let testAccount = await nodemailer.createTestAccount();


    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.CLASS_SERVICE_GMAIL,
            pass: process.env.CLASS_SERVICE_PASS
        }
    });

    try {
        const existingUser = await UsersService.findOneByEmail(emailReceiver);
        console.log(existingUser);
        if (existingUser !== null) {
            const studentId = existingUser.id;
            await CoursesService.createStudent(courseId, studentId);            
        }
    } catch (err) {
        console.log(err);
    };

    try {
        let info = await transporter.sendMail({
            from: `${sender} <${emailSender}>`, 
            to: emailReceiver, 
            subject: "New invitation to classroom", 
            text: 'You recieved message from ' + sender, 
            html: "Hello,<br> You have an invitation to " + sender + "'s classroom<br><br> Please Click on the link to accept your invitation.<br><a href=" + invitationLink + ">" + invitationLink + "</a>"
        });

        if (info !== null) {
            res.send({msg: 'Invitation sent!'});
        } else {
            res.status(404).send({
                msg: 'Could not send invitation'
            });
        }
    } catch (err) {
        res.status(500).send({
            msg: err.message || "Some error occurred while sending invitation."
        });
    }
};

exports.updateStudent = async (req, res) => { 
    if (!req.body) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
    }

    try {
        const course = await CoursesService.findOne(req.body.invitationId);
        const student = await CoursesService.findPendingStudent(course.id, req.body.userId);
        let isSuccess = null;
        
        console.log(student);
        if (student !== null) {
            console.log('update');
            isSuccess = await CoursesService.updateStudent(course.id, student.studentId);
        } else {
            console.log('create');
            isSuccess = await CoursesService.addStudent(course.id, req.body.userId);
        }

        if (isSuccess !== null) {
            res.send({
                courseId: course.id,
                msg: "You are joined!"
            });
        } else {
            res.status(400).send({
                msg: "Some error occurred while adding student."
            });
        }
    } catch (err) {
        res.status(500).send({
            msg: err.message || "Some error occurred while adding student."
        });
    }
}

