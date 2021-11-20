const User = require('../users/usersModel').User;
const UserInfo = require('../users/usersModel').UserInfo;
const Course = require('../courses/coursesModel').Course;
const Teacher = require('../courses/coursesModel').Teacher;
const Student = require('../courses/coursesModel').Student;

function applyExtraSetup() {
    // Course - owner relationship
    User.hasMany(Course, {
        foreignKey: {
            name: 'ownerId',
            allowNull: false
        }
    });
    Course.belongsTo(User, {
        foreignKey: {
            name: 'ownerId',
            allowNull: false
        },
        targetKey: 'id'
    });

    // teacher relationship
    User.belongsToMany(Course, {
        through: Teacher,
        foreignKey: {
            name: 'teacherId',
            allowNull: false
        }
    });
    Course.belongsToMany(User, {
        through: Teacher,
        foreignKey: {
            name: 'courseId',
            allowNull: false
        }
    });

    // student relationship
    User.belongsToMany(Course, {
        through: Student,
        foreignKey: {
            name: 'studentId',
            allowNull: false
        }
    });
    Course.belongsToMany(User, {
        through: Student,
        foreignKey: {
            name: 'courseId',
            allowNull: false
        }
    });

    // user's information relationship
    User.HasOne(UserInfo, {
        foreignKey: {
            name: 'ownerInfoId',
            allowNull: false
        }
    });
    UserInfo.belongsTo(User, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        }
    });
}

module.exports = { applyExtraSetup };