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
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving courses."
        });
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
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    }

}

exports.updateStudentID = async (req, res, next) => {
    try {
        await adminService.updateStudentID(req.body.id, req.body.studentID);
        res.send("Success");
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving updating."
        });
    }
}