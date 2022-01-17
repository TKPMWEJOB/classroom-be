const bcrypt = require('bcrypt');

const adminService = require('./adminService');
const usersService = require('../users/usersService');
const saltRounds = 10;
exports.courses = async (req, res, next) => {
    try {
        const query = req.query;
        const name = query.name ? query.name : '';
        const createdDateOrder = query.order ? query.order : 'ASC';
        const data = await adminService.findAllCourses(name, createdDateOrder);
        return res.send(data);
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }

}

exports.users = async (req, res, next) => {
    try {
        const query = req.query;
        const name = query.name ? query.name : '';
        const createdDateOrder = query.order ? query.order : 'ASC';
        const data = await adminService.findAllUsers(name, createdDateOrder);
        return res.send(data);
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }

}

exports.usersUpdate = async (req, res, next) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    const user = {
        ...req.body
    };

    try {
        const num = await usersService.update(user, user.id);
        if (num) {
            res.status(200).send({
                msg: 'User account locked!'
            });
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

exports.admins = async (req, res, next) => {
    try {
        const query = req.query;
        const name = query.name ? query.name : '';
        const createdDateOrder = query.order ? query.order : 'ASC';
        const data = await adminService.findAllAdmins(name, createdDateOrder);
        return res.send(data);
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.adminsCreate = async (req, res, next) => {
    if (!req.body || !req.body.email || !req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
        return;
    }

    let hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        activateToken : 0,
        isAdmin: true,
    };

    console.log("user:", user);

    try {
        const duplicateUser = await usersService.findOneByEmail(user.email);
        //console.log(duplicateUser);
        if (duplicateUser !== null) {
            res.status(409).send({
                msg: "This email is already exist!"
            });
        } else {
            const data = await usersService.create(user);
            res.status(200).send({...user, msg: "Account created!"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg:
                err.message || "Some error occurred while creating account."
        });
    };
}