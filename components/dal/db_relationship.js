const User = require('../users/usersModel');
const Course = require('../courses/coursesModel').Course;
const Teacher = require('../courses/coursesModel').Teacher;
const Student = require('../courses/coursesModel').Student;
const OfficialStudent = require('../courses/coursesModel').OfficialStudent;
const GradeCategory = require('../gradeStructure/gradeStructureModel');
const StudentRecord = require('../studentRecords/studentRecordsModel');

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
            allowNull: false
        }
    });

    StudentRecord.belongsTo(Course, {
        foreignKey: {
            name: 'courseId',
            allowNull: false
        },
        targetKey: 'id'
    });

    GradeCategory.hasMany(StudentRecord, {
        foreignKey: {
            name: 'gradeId',
            allowNull: false
        }
    });

    StudentRecord.belongsTo(GradeCategory, {
        foreignKey: {
            name: 'gradeId',
            allowNull: false
        },
        targetKey: 'id'
    });

    OfficialStudent.hasMany(StudentRecord, {
        foreignKey: {
            name: 'studentId',
            allowNull: false
        }
    });

    StudentRecord.belongsTo(OfficialStudent, {
        foreignKey: {
            name: 'studentId',
            allowNull: false
        },
        targetKey: 'id'
    });
}

module.exports = { applyExtraSetup };