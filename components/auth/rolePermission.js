const CoursesService = require('../courses/coursesService');

module.exports.getRole = async (userId, courseId) => {
    let course;
    try {
        course = await CoursesService.findOne(courseId);
        if (course.ownerId === userId) {
            return 'owner';
        }
    } catch(err){
        console.log("Not owner", err);
    }

    try {
        course = await CoursesService.findPendingTeacher(courseId, userId);
        if (course) {
            return 'teacher';
        }
    } catch(err){
        console.log("Not owner", err);
    }

    try {
        course = await CoursesService.findPendingStudent(courseId, userId);
        if (course) {
            return 'student';
        }
    } catch(err){
        console.log("Not owner", err);
    }

    return 'guest';
}