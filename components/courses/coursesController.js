"use strict";
const CoursesService = require('./coursesService');
const UsersService = require('../users/usersService');
const jwtDecode = require('jwt-decode');
const referralCodes = require('referral-codes');
const nodemailer = require('nodemailer');
const Permission = require('../auth/rolePermission');
const { Course } = require('./coursesModel');

const inviteTeacherLimitTime = 60 * 60; // 1 hour

exports.index = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    try {
        const teachingCourses = await CoursesService.findAllCoursesWithTeacherId(parsedToken.user.id);
        const studyingCourses = await CoursesService.findAllCoursesWithStudentId(parsedToken.user.id);
        const data = teachingCourses.concat(studyingCourses);
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

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }

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
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    
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
    //const role = req.body.role;
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
    //let isInviteTeacherError = false;

    try {
        //console.log('access');
        const existingUser = await UsersService.findOneByEmail(emailReceiver);
        //console.log(existingUser);
        if (existingUser !== null) {
            const userId = existingUser.id;
            const student = await CoursesService.findPendingStudent(courseId, userId);
            const teacher = await CoursesService.findPendingTeacher(courseId, userId);
            //console.log(student);
            //console.log(teacher);

            if (teacher !== null) {
                if (teacher.confirmed) {
                    res.status(404).send({
                        msg: 'User is teacher in your class'
                    });
                }
                else {
                    if (student !== null) {
                        if (student.confirmed) {
                            res.status(404).send({
                                msg: 'User has already been in your class'
                            });
                        }
                        else {
                            isAcceptSendMail = true;
                        }
                    }
                    else {
                        isAcceptSendMail = true;
                    }
                }
            }
            else {
                if (student !== null) {
                    if (student.confirmed) {
                        res.status(404).send({
                            msg: 'User has already been in your class'
                        });
                    }
                    else {
                        isAcceptSendMail = true;
                    }
                }
                else {
                    isAcceptSendMail = true;
                }
            }
        }
        else {
            isAcceptSendMail = true;
        }

    } catch (err) {
        console.log(err);
    };

    if (isAcceptSendMail) {
        try {
            const course = await CoursesService.findOne(courseId);
            
            const Link = invitationLink.concat(course.invitationId);

            let info = await transporter.sendMail({
                from: `${sender} <${emailSender}>`,
                to: emailReceiver,
                subject: "New invitation to classroom",
                text: 'You recieved message from ' + sender,
                html: "Hello,<br> You have an invitation to " + sender + "'s classroom<br><br> Please Click on the link to accept your invitation.<br><a href=" + Link + ">" + Link + "</a>"
            });

            if (info !== null) {
                res.send({ msg: 'Invitation sent!' });
            } else {
                res.status(500).send({
                    msg: "Some error occurred while sending invitation."
                });
            }
        } catch (err) {
            res.status(500).send({
                msg: "Some error occurred while sending invitation."
            });
        }
    }
};

exports.inviteTeacher = async (req, res) => {
    //const role = req.body.role;
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
    //let isInviteTeacherError = false;
    let existingUser = null;
    try {
        existingUser = await UsersService.findOneByEmailV2(emailReceiver);
        if (existingUser !== null) {
            const userId = existingUser.id;
            //const student = await CoursesService.findPendingStudent(courseId, userId);
            const teacher = await CoursesService.findPendingTeacher(courseId, userId);
            //console.log(student);
            //console.log(teacher);
            if (teacher !== null) {
                if (teacher.confirmed) {
                    res.status(404).send({
                        msg: 'Teacher has already been in your class'
                    });
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
            isAcceptSendMail = true;
        }

    } catch (err) {
        console.log(err);
    };

    if (isAcceptSendMail) {
        try {
            const code = referralCodes.generate({
                length: 12
            });
            let invitationCode = code[0];

            if (existingUser) {
                const invitation = await CoursesService.findOneInvitation(courseId, emailReceiver);
                if (invitation) {
                    let diff = (Date.now() - invitation.teacherInvitationTimeout) / 1000;
                    if (diff <= inviteTeacherLimitTime) {
                        invitationCode = invitation.teacherInvitationCode;
                    }
                    let invitationInfo = {
                        teacherInvitationCode: invitationCode,
                        teacherInvitationTimeout: Date.now()
                    }

                    await CoursesService.updateTeacherInvitation(invitationInfo, invitation.id);
                }
                else {
                    let invitationInfo = {
                        teacherInvitationCode: invitationCode,
                        teacherInvitationTimeout: Date.now(),
                        email: emailReceiver,
                        courseId: courseId
                    }
                    await CoursesService.addTeacherInvitation(invitationInfo);
                }
            }
            else {
                let invitationInfo = {
                    teacherInvitationCode: invitationCode,
                    teacherInvitationTimeout: Date.now(),
                    email: emailReceiver,
                    courseId: courseId
                }
                await CoursesService.addTeacherInvitation(invitationInfo);
            }

            const Link = invitationLink.concat(invitationCode);

            let info = await transporter.sendMail({
                from: `${sender} <${emailSender}>`,
                to: emailReceiver,
                subject: "New invitation to classroom",
                text: 'You recieved message from ' + sender,
                html: "Hello,<br> You have an invitation to " + sender + "'s classroom with teacher role<br><br> Please Click on the link to accept your invitation.<br><a href=" + Link + ">" + Link + "</a>"
            });

            if (info !== null) {
                res.send({ msg: 'Invitation sent!' });
            } else {
                res.status(404).send({
                    msg: 'Teacher has already been in your class'
                });
            }
        } catch (err) {
            res.status(500).send({
                msg: "Some error occurred while sending invitation."
            });
        }
    }
};

exports.invitationHandle = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
    }
    
    const invitationId = req.body.invitationId;

    if (invitationId.length === 8) {
        try {
            const course = await CoursesService.findOne(req.body.invitationId);
            const student = await CoursesService.findPendingStudent(course.id, req.body.userId);
            const teacher = await CoursesService.findPendingTeacher(course.id, req.body.userId);
            let isSuccess = null;
    
            if (student !== null && teacher !== null) {
                if (!teacher.confirmed) {
                    isSuccess = await CoursesService.updateStudentJoin(course.id, student.studentId);
                }
                isSuccess = true;
            }
            else if (student === null && teacher === null) {
                isSuccess = await CoursesService.addStudent(course.id, req.body.userId);
            }
            else if (student === null && teacher !== null) {
                if (!teacher.confirmed) {
                    isSuccess = await CoursesService.addStudent(course.id, req.body.userId);
                }
                isSuccess = true;
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
    else if (invitationId.length === 12) {
        try {
            const invitationInfo = await CoursesService.findOneInvitationByCode(req.body.invitationId);
            if (invitationInfo) {
                const user = await UsersService.findOne(req.body.userId);
                if (user.email === invitationInfo.email) {
                    const teacher = await CoursesService.findPendingTeacher(invitationInfo.courseId, req.body.userId);
                    let isSuccess = null;
    
                    if (teacher) {
                        if (!teacher.confirmed) {
                            let diff = (Date.now() - invitationInfo.teacherInvitationTimeout) / 1000;
                            if (diff <= inviteTeacherLimitTime) {
                                isSuccess = await CoursesService.updateTeacherJoin(invitationInfo.courseId, teacher.teacherId);
                            }
                        }
                        else {
                            isSuccess = true;
                        }
                    }
                    else {
                        let diff = (Date.now() - invitationInfo.teacherInvitationTimeout) / 1000;
                        if (diff <= inviteTeacherLimitTime) {
                            isSuccess = await CoursesService.addTeacher(invitationInfo.courseId, req.body.userId);
                        }
                    }
    
                    if (isSuccess !== null) {
                        res.send({
                            courseId: invitationInfo.courseId,
                            msg: "You are joined!"
                        });
                    } else {
                        res.status(400).send({
                            msg: "Some error occurred while adding teacher."
                        });
                    }
                }
                else {
                    res.status(400).send({
                        msg: "You are not permit to join with role teacher."
                    });
                }
            }
            else {
                res.status(400).send({
                    msg: "Can't find link."
                });
            }   
            
        } catch (err) {
            res.status(500).send({
                msg: err.message || "Some error occurred while adding member."
            });
        }
    }
    else {
        res.status(500).send({
            msg: err.message || "Invalid link."
        });
    }
}

exports.invitationTeacherHandle = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
    }

    
}

exports.joinByCode = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);
    if (!req.body) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
        return;
    }
    const invitationId = req.body.invitationId;

    if (invitationId.length === 8) {
        try {
            const course = await CoursesService.findOne(invitationId);
            const student = await CoursesService.findPendingStudent(course.id, parsedToken.user.id);

            let isSuccess = null;
    
            if (student !== null) {
                res.status(409).send({
                    msg: "You have already joined this class!"
                });
                return;
            }
            else {
                isSuccess = await CoursesService.addStudent(course.id, parsedToken.user.id);
            }
    
            if (isSuccess !== null) {
                res.status(200).send({
                    courseId: course.id,
                    msg: "Join class successfully!"
                });
            }
        } catch (err) {
            res.status(500).send({
                msg: err.message || "Some error occurred while adding student."
            });
            return;
        }        
    }
    else {
        res.status(404).send({
            msg: "Invalid code."
        });
        return;
    }
}

exports.findAllPeople = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner' && role != 'student') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }
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