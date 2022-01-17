const adminService = require('./adminService');
const usersService = require('../users/usersService');

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