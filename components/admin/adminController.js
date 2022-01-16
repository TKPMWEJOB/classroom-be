const adminService = require('./adminService');

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