const User = require('../users/usersModel');
const Notification = require('../notification/notificationModel');
const Course = require('../courses/coursesModel').Course;
const Teacher = require('../courses/coursesModel').Teacher;
const Student = require('../courses/coursesModel').Student;
const TeacherInvitation = require('../courses/coursesModel').TeacherInvitation;
const GradeCategory = require('../gradeStructure/gradeStructureModel');
const StudentRecord = require('../studentRecords/studentRecordsModel').StudentRecord;
const OfficialStudent = require('../studentRecords/studentRecordsModel').OfficialStudent;


function applyExtraSetup() {
    // Course - owner relationship
    User.hasMany(Course, {
        foreignKey: {
            name: 'ownerId',
            allowNull: false
        },
        as: 'owner',
    });
    Course.belongsTo(User, {
        foreignKey: {
            name: 'ownerId',
            allowNull: false
        },
        as: 'owner',
        targetKey: 'id'
    });

    // teacher relationship
    User.belongsToMany(Course, {
        through: Teacher,
        foreignKey: {
            name: 'teacherId',
            allowNull: false
        },
        as: 'teachers'
    });
    Course.belongsToMany(User, {
        through: Teacher,
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        as: 'teachers'
    });

    // student relationship
    User.belongsToMany(Course, {
        through: Student,
        foreignKey: {
            name: 'studentId',
            allowNull: false
        },
        as: 'students'
    });
    Course.belongsToMany(User, {
        through: Student,
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        as: 'students'
    });

    // teacher invitation relationship
    Course.hasMany(TeacherInvitation, {
        foreignKey: {
            name: 'courseId',
            allowNull: false
        }
    });

    TeacherInvitation.belongsTo(Course, {
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        targetKey: 'id'
    });

    // grade relationship
    Course.hasMany(GradeCategory, {
        foreignKey: {
            name: 'courseId',
            allowNull: false
        }
    });

    GradeCategory.belongsTo(Course, {
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        targetKey: 'id'
    });

    // Student Record relationship
    Course.hasMany(StudentRecord, {
        foreignKey: {
            name: 'courseId',
            unique: 'recordIndexes',
            allowNull: false
        }
    });

    StudentRecord.belongsTo(Course, {
        foreignKey: {
            name: 'courseId',
            unique: 'recordIndexes',
            allowNull: false
        },
        onDelete: 'cascade',
        targetKey: 'id'
    });

    GradeCategory.hasMany(StudentRecord, {
        foreignKey: {
            name: 'gradeId',
            unique: 'recordIndexes',
            allowNull: false
        }
    });

    StudentRecord.belongsTo(GradeCategory, {
        foreignKey: {
            name: 'gradeId',
            unique: 'recordIndexes',
            allowNull: false
        },
        onDelete: 'cascade',
        targetKey: 'id'
    });

    OfficialStudent.hasMany(StudentRecord, {
        foreignKey: {
            name: 'studentId',
            unique: 'recordIndexes',
            allowNull: false
        }
    });

    StudentRecord.belongsTo(OfficialStudent, {
        foreignKey: {
            name: 'studentId',
            unique: 'recordIndexes',
            allowNull: false
        },
        onDelete: 'cascade',
        targetKey: 'id'
    });

    // OfficialStudent Course relationship
    Course.hasMany(OfficialStudent, {
        foreignKey: {
            name: 'courseId',
            allowNull: false
        }
    });

    OfficialStudent.belongsTo(Course, {
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        targetKey: 'id'
    });

    // notification relationship
    Notification.belongsTo(User, {
        foreignKey: {
            name: 'senderId',
            allowNull: false
        },
        targetKey: 'id'
    });
}

module.exports = { applyExtraSetup };