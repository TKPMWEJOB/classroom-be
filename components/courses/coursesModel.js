// const ObjectId = require('mongodb').ObjectId;
const db = require('../dal/db');

const Course = function (course) {
    this.name = course.name;
    this.instructor = course.instructor;
    this.description = course.description;
};


Course.getAll = result => {
    db.query("SELECT * FROM Courses", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("courses: ", res);
        result(null, res);
    });
};

Course.create = (newCourse, result) => {
    db.query("INSERT INTO Courses SET ?", newCourse, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created course: ", { id: res.insertId, ...newCourse });
        result(null, { id: res.insertId, ...newCourse });
    });
};

Course.remove = (id, result) => {
    db.query("DELETE FROM Courses WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted course with id: ", id);
        result(null, res);
    });
};

Course.updateById = (id, course, result) => {
    db.query(
        "UPDATE Courses SET name = ?, instructor = ?, description = ? WHERE id = ?",
        [course.name, course.instructor, course.description, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found course with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated course: ", { id: id, ...course });
            result(null, { id: id, ...course });
        }
    );
};

module.exports = Course;