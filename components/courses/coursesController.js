"use strict";
const CoursesService = require('./coursesService');
const UsersService = require('../users/usersService');
const jwtDecode = require('jwt-decode');
const referralCodes = require('referral-codes');
const nodemailer = require('nodemailer');
const Permission = require('../auth/rolePermission');

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
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    let isGenerated = false;
    let invitationCode = '';
    while (!isGenerated) {
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
    const token = req.cookies.token;
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
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    try {
        const num = await CoursesService.update(req.body, req.params.id, parsedToken.user.id);
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
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id)
    console.log('Role:', role);

    if (role === 'guest') {
        res.status(404).send({
            message: 'Course not found'
        });
    }

    try {
        const data = await CoursesService.findOne(req.params.id);
        if (data !== null) {
            //console.log(data);
            res.send({ data, role });
        } else {
            res.status(404).send({
                message: 'Course not found'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while finding the course."
        });
    }
};

exports.inviteMember = async (req, res) => {
    const role = req.body.role;
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

    let isAcceptSendMail = false;

    try {
        const existingUser = await UsersService.findOneByEmail(emailReceiver);
        if (existingUser !== null) {
            const userId = existingUser.id;
            const student = await CoursesService.findPendingStudent(courseId, userId);
            const teacher = await CoursesService.findPendingTeacher(courseId, userId);
            console.log('compare');
            if (student !== null || teacher !== null) {
                if(student !== null) {
                    if (student.confirmed && role === 'student') {
                        isAcceptSendMail = false;
                    }
                    else {
                        isAcceptSendMail = true;
                    }
                }
                else if (teacher !== null) {
                    if (teacher.confirmed && role === 'teacher') {
                        isAcceptSendMail = false;
                    }
                    else {
                        isAcceptSendMail = true;
                    }
                }
                else {
                    isAcceptSendMail = true;
                }
            }
            else {
                if (role === 'student') {
                    await CoursesService.createStudent(courseId, userId);
                    isAcceptSendMail = true;
                }
                else if (role === 'teacher') {
                    await CoursesService.createTeacher(courseId, userId);
                    isAcceptSendMail = true;
                }
            }
            
        }
    } catch (err) {
        console.log(err);
    };

    if (isAcceptSendMail) {
        try {
            let info = await transporter.sendMail({
                from: `${sender} <${emailSender}>`,
                to: emailReceiver,
                subject: "New invitation to classroom",
                text: 'You recieved message from ' + sender,
                html: "Hello,<br> You have an invitation to " + sender + "'s classroom<br><br> Please Click on the link to accept your invitation.<br><a href=" + invitationLink + ">" + invitationLink + "</a>"
            });
    
            if (info !== null) {
                res.send({ msg: 'Invitation sent!' });
            } else {
                res.status(404).send({
                    msg: 'Could not send invitation'
                });
            }
        } catch (err) {
            res.status(500).send({
                msg: "Some error occurred while sending invitation."
            });
        }
    }
    else {
        res.status(500).send({
            msg: `${role} has already in class`
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
        const teacher = await CoursesService.findPendingTeacher(course.id, req.body.userId);
        let isSuccess = null;

        console.log(student);
        console.log(teacher);

        if (student !== null && teacher !== null) {
            if (!teacher.confirmed) {
                await CoursesService.updateStudentEject(course.id, student.studentId);
                isSuccess = await CoursesService.updateTeacherJoin(course.id, teacher.teacherId);
            }
        }
        else if (student === null && teacher === null) {
            isSuccess = await CoursesService.addStudent(course.id, req.body.userId); 
        }
        else if (student === null && teacher !== null) {
            isSuccess = await CoursesService.updateTeacherJoin(course.id, teacher.teacherId);
        }
        else {
            isSuccess = await CoursesService.updateStudentJoin(course.id, student.studentId);
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

exports.findAllPeople = async (req, res) => {
    try {
        const students = await CoursesService.findAllStudents(req.params.id);
        const teachers = await CoursesService.findAllTeachers(req.params.id);
        res.send({ students, teachers });
    } catch (err) {
        res.status(500).send({
            msg: err.message || "Some error occurred while adding student."
        });
    }
}