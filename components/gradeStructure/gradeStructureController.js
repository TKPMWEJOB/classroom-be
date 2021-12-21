"use strict";
const GradesService = require('./gradeStructureService');
const StudentRecordsService = require('../studentRecords/studentRecordsService');
const jwtDecode = require('jwt-decode');
const Permission = require('../auth/rolePermission');

exports.index = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner' && role != 'student') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }

    try {
        const gradeStructure = await GradesService.findAll(req.params.id);
        res.send(gradeStructure);
    } catch (err) {
        res.status(500).send({
            msg: err.message || "Some error occurred while finding grade structure."
        });
    }
};

exports.create = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const newGrade = {
        courseId: req.params.id,
        title: req.body.title,
        point: req.body.point,
        index: req.body.index
    }

    try {
        const savedGrade = await GradesService.create(newGrade);
        const gradeStructure = await GradesService.findAll(req.params.id);
        const students = await StudentRecordsService.getStudentList(req.params.id);
        console.log(students);
        await students.forEach(async (student) => {
            let studentRecord = { 
                courseId: req.params.id,
                gradeId: savedGrade.id,
                studentId: student.id,
            };

            await StudentRecordsService.updateOrInsertStudentRecord(studentRecord);
        });

        res.send(gradeStructure);

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the grade."
        });
    };
};

exports.delete = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }

    try {
        const num = await GradesService.delete(req.params.id, req.body.id);
        if (num == 1) {
            const gradeStructure = await GradesService.findAll(req.params.id);
            res.send(gradeStructure);
            /*res.send({
                message: 'Delete successfully!'
            });*/
        } else {
            res.status(404).send({
                message: 'Grade not found'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting the grade."
        });
    }
};

exports.updateAll = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        const result = await GradesService.updateAll(req.params.id, req.body.data);
        res.send(result);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the grade."
        });
    }
};

exports.updateOne = async (req, res) => {
    const token = req.cookies.token;
    const parsedToken = jwtDecode(token);

    const role = await Permission.getRole(parsedToken.user.id, req.params.id);
    if (role != 'teacher' && role != 'owner') {
        res.status(403).send({
            message: 'Forbbiden'
        });
    }

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    try {
        console.log(req.body.data);
        const num = await GradesService.updateOne(req.params.id, req.body.data);
        if (num == 1) {
            const gradeStructure = await GradesService.findAll(req.params.id);
            res.send(gradeStructure);
            /*res.send({
                message: 'Update successfully!'
            });*/
        } else {
            res.status(404).send({
                message: 'Grade not found'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while updating the grade."
        });
    }
};
