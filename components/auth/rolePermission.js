const CoursesService = require('../courses/coursesService');
const jwtDecode = require('jwt-decode');

module.exports.getRole = async (userId, courseId) => {
    let course;
    try {
        course = await CoursesService.findOne(courseId);
        if (course.ownerId === userId) {
            return 'owner';
        }
    } catch (err) {
        console.log("Not owner", err);
    }

    try {
        course = await CoursesService.findPendingTeacher(courseId, userId);
        if (course) {
            return 'teacher';
        }
    } catch (err) {
        console.log("Not owner", err);
    }

    try {
        course = await CoursesService.findPendingStudent(courseId, userId);
        if (course) {
            return 'student';
        }
    } catch (err) {
        console.log("Not owner", err);
    }

    return 'guest';
}

module.exports.grantPermission = (roles) => {
    return async function (req, res, next) {
        const token = req.cookies.token;
        const parsedToken = jwtDecode(token);
        const role = await this.getRole(parsedToken.user.id, req.params.id);
        if (roles.includes(role)) {
            next();
        }
        else {
            res.status(403).send({
                message: 'Forbbiden'
            });
        }
    }
}