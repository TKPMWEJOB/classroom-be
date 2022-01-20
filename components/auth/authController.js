"use strict";
const jwt = require('jsonwebtoken');
const passport = require('passport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const UsersService = require('../users/usersService');
const { default: axios } = require('axios');

const saltRounds = 10;
const resetPasswordLimitTime = 60 * 15; // 15 minutes

exports.signin = async (req, res, next) => {
    await passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log(err);
        console.log(user);
        console.log(info);
        if (err) {
            res.status(500).send(JSON.stringify({
                msg: "Internal Server Error"
            }));
        }

        if (!user) {
            res.status(401).send(JSON.stringify({
                msg: info.message
            }));
        }

        //Admin page
        if(req.headers.origin === process.env.ADMIN_CLIENT_ADDRESS)
        {
            if (!user.isAdmin && !user.isSuperAdmin) {
                return res.status(401).send(JSON.stringify({
                    msg: "You are not allow!"
                }));
            }
        }

        if (user) {
            const body = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            }
            const jwtToken = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY);
            let maxAge = req.body.remember ? 7 * 24 * 60 * 60 * 1000 : 2* 60 * 60 * 1000; //remeber me 7 days else 2h 

            //res.json({body, token});
            res.status(200)
                .cookie("token", jwtToken, {maxAge, httpOnly: true, sameSite: "none", secure: true})
                .send(JSON.stringify({
                    body,
                    jwtToken,
                    msg: "Successfully logged in",
            }));
        }
    })(req, res, next);
};

exports.signup = async (req, res) => {
    if (!req.body || !req.body.email || !req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
        return;
    }

    const token = crypto.randomBytes(32).toString('hex');

    let hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        activateToken : token,
    };

    console.log("user:", user);

    try {
        const duplicateUser = await UsersService.findOneByEmail(user.email);
        //console.log(duplicateUser);
        if (duplicateUser !== null) {
            res.status(409).send({
                msg: "This email is already exist!"
            });
        } else {
            const data = await UsersService.create(user);
            res.status(200).send({...user, msg: "Account created! Please activate your account!"});
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.CLASS_SERVICE_GMAIL,
                pass: process.env.CLASS_SERVICE_PASS
            }
        });

        let info = await transporter.sendMail({
            from: 'No-Reply Moorssalc Elgoog Classroom <no-reply-moorssalcelgoog@moorssalcelgoog.com>',
            to: user.email,
            subject: "Moorssalc Elgoog Classroom Account Activate",
            html: `<h3>Welcome to Moorssalc Elgoog Classroom!</h3> <br>
            <p>You are receiving this because you have registered to Moorssalc Elgoog Classroom.</p>
            <p>Please click on the following link, or paste this into your browser to activate your account:</p>
            <a target="_blank" rel="noopener noreferrer" href="${req.headers.origin}/auth/activate/${token}"> Activate account </a> <br>
            <p>Best wishes.<p>`,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg:
                err.message || "Some error occurred while creating account."
        });
    };
};

exports.checkInfo = async (req, res) => {
    if (!req.body || (!req.body.email && !req.body.username)) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
        return;
    }

    const userCheck = {
        email: req.body.email,
        username: req.body.username,
    };

    console.log(userCheck);
    try {
        let user;
        if (userCheck.email) {
            user = await UsersService.findOneByEmail(userCheck.email);
        } else if (userCheck.username) {
            user = await UsersService.findOneByUsername(userCheck.username);
        }

        console.log(user);
        if (user !== null) {
            res.status(409).send({
                msg: "This user is already exist!"
            });
        } else {
            res.status(200).send({msg: "Available!"});
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg:
                err.message || "Some error occurred while creating account."
        });
    };
};

exports.logout = async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).send({
        msg: "Logged out!"
    });
};

exports.google = async (req, res, next) => {
    try {
        const { token }  = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();   

        const duplicateUser = await UsersService.findOneByEmail(payload.email);
        let userInfo = {
            email: payload.email,
            username: payload.email.split("@")[0],
            firstName: payload.given_name,
            lastName: payload.family_name,
            isActivated: true,
            activateToken: "0",
        };
        if (duplicateUser === null) {
            userInfo = await UsersService.create(userInfo);            
        } else {
            if (duplicateUser.isLocked) {
                res.status(403).send({
                    msg: "Your account has been locked by admin!"
                });
                return;
            }
            userInfo = duplicateUser;
        }

        const body = {
            id: userInfo.id,
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            username: userInfo.username,
        }

        const jwtToken = jwt.sign({user: body}, process.env.JWT_SECRET_KEY);
            let maxAge = 7 * 24 * 60 * 60 * 1000; //7 days 
            //res.json({body, token});
            res.status(200)
                .cookie("token", jwtToken, {maxAge, httpOnly: true, sameSite: "none", secure: true})
                .send(JSON.stringify({
                    body,
                    jwtToken,
                    msg: "Successfully logged in",
            }));

        console.log(payload);
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: err.message || "Some error occurred while creating account."
        });
    }
}; 

exports.facebook = async (req, res, next) => {
    try {
        const { token }  = req.body;

        const valRes = await axios.get(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${process.env.FACEBOOK_CLIENT_ID}|${process.env.FACEBOOK_CLIENT_SECRET}`);

        if (valRes.data.data.is_valid)
        {
            const duplicateUser = await UsersService.findOneByEmail(req.body.email);
            let userInfo = {
                email: req.body.email,
                username: req.body.email.split("@")[0],
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                isActivated: true,
                activateToken: "0",
            };
            if (duplicateUser === null) {
                userInfo = await UsersService.create(userInfo);            
            } else {
                if (duplicateUser.isLocked) {
                    res.status(403).send({
                        msg: "Your account has been locked by admin!"
                    });
                    return;
                }
                userInfo = duplicateUser;
            }

            const body = {
                id: userInfo.id,
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                username: userInfo.username,
            }
            
            const jwtToken = jwt.sign({user: body}, process.env.JWT_SECRET_KEY);
                let maxAge = 7 * 24 * 60 * 60 * 1000; //7 days 
                //res.json({body, token});
                res.status(200)
                    .cookie("token", jwtToken, {maxAge, httpOnly: true, sameSite: "none", secure: true})
                    .send(JSON.stringify({
                        body,
                        jwtToken,
                        msg: "Successfully logged in",
                }));
    
        } else {
            res.status(401)
                .send({ msg: valRes.data.data.error.message || "Successfully logged in" });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: err.message || "Some error occurred while creating account."
        });
    }
}; 

exports.emailResend = async (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
    }

    let targetEmail = req.body.email;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.CLASS_SERVICE_GMAIL,
            pass: process.env.CLASS_SERVICE_PASS
        }
    });

    try {
        const existingUser = await UsersService.findOneByEmail(targetEmail);
        
        if (existingUser !== null) {
            const userId = existingUser.id;

            const token = crypto.randomBytes(32).toString('hex');
            let tokenInfos = {
                activateToken : token
            }

            await UsersService.update(tokenInfos, userId);
            
            let info = await transporter.sendMail({
                from: 'No-Reply Moorssalc Elgoog Classroom <no-reply-moorssalcelgoog@moorssalcelgoog.com>',
                to: targetEmail,
                subject: "Moorssalc Elgoog Classroom Account Activate",
                html: `<h3>Welcome to Moorssalc Elgoog Classroom!</h3> <br>
                <p>You are receiving this because you have registered to Moorssalc Elgoog Classroom.</p>
                <p>Please click on the following link, or paste this into your browser to activate your account:</p>
                <a target="_blank" rel="noopener noreferrer" href="${req.headers.origin}/auth/activate/${token}"> Activate account </a> <br>
                <p>Best wishes.<p>`,
            });

            if (info !== null) {
                res.status(200).send({ msg: 'Email resent!' });
            } else {
                res.status(500).send({
                    msg: 'Could not send email!'
                });
            }
        } else {
            res.status(401).send({
                msg: 'This email is not sign up yet!'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: "Some error occurred while sending email."
        });
    }
};

exports.activate = async (req, res, next) => {
    try {
        const { token }  = req.params;
        const user = await UsersService.findOneByActivateToken(token);
        
        if (user) {
            await UsersService.update({isActivated: true}, user.id);
            res.status(200).send({
                msg: 'Account activated!'
            });
        } else {
            res.status(404).send({
                msg: "Invalid link!"
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: err.message || "Some error occurred while activating account."
        });
    }
};

exports.resetPasswordEmail = async (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
    }

    let targetEmail = req.body.email;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.CLASS_SERVICE_GMAIL,
            pass: process.env.CLASS_SERVICE_PASS
        }
    });

    try {
        const existingUser = await UsersService.findOneByEmail(targetEmail);
        
        if (existingUser !== null) {
            const userId = existingUser.id;

            const token = crypto.randomBytes(32).toString('hex');
            let tokenInfos = {
                resetPasswordToken: token,
                resetPasswordTimeout: Date.now(),
            }

            await UsersService.update(tokenInfos, userId);
            
            let info = await transporter.sendMail({
                from: 'No-Reply Moorssalc Elgoog Classroom <no-reply-moorssalcelgoog@moorssalcelgoog.com>',
                to: targetEmail,
                subject: "Moorssalc Elgoog Classroom Password Reset",
                html: `<h3>Moorssalc Elgoog Classroom</h3> <br>
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to reset your password (will expire in 15 minutes):</p> <br>
                <a target="_blank" rel="noopener noreferrer" href="${req.headers.origin}/auth/reset/${token}"> Reset password</a> <br>
                <p>Best wishes.<p>`,
            });

            if (info !== null) {
                res.status(200).send({ msg: 'Email sent!' });
            } else {
                res.status(500).send({
                    msg: 'Could not send email!'
                });
            }
        } else {
            res.status(401).send({
                msg: 'This email is not sign up yet!'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: "Some error occurred while sending email."
        });
    }
};

exports.checkResetPasswordToken = async (req, res, next) => {
    try {
        const { token }  = req.params;
        
        console.log(token);
        const user = await UsersService.findOneByResetToken(token);
        
        if (user) {
            let diff = (Date.now() - user.resetPasswordTimeout) / 1000;
            if (diff > resetPasswordLimitTime) {
                res.status(401).send({
                    msg: "Reset link expired!"
                });
            } else {
                console.log(diff);
                res.status(200).send({
                    msg: 'Good link!'
                });
            }
        } else {
            res.status(404).send({
                msg: "Invalid link!"
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: err.message || "Some error occurred!"
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token }  = req.params;
        const newPass  = req.body.password;
        
        console.log(token);
        const user = await UsersService.findOneByResetToken(token);
        
        if (user) {
            let diff = (Date.now() - user.resetPasswordTimeout) / 1000;
            if (diff > resetPasswordLimitTime) {
                res.status(401).send({
                    msg: "Reset link expired!"
                });
            } else {
                let hash = bcrypt.hashSync(newPass, saltRounds);
                await UsersService.update({
                    password: hash,
                    resetPasswordToken: null,
                    resetPasswordTimeout: null,
                }, user.id);
                res.status(200).send({
                    msg: 'Password reset!'
                });
            }
        } else {
            res.status(404).send({
                msg: "Invalid link!"
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: err.message || "Some error occurred while reset password."
        });
    }
};