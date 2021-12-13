const csv = require("fast-csv");
const { Readable } = require("stream")
const StudentRecordsService = require('./studentRecordsService');

exports.index = async (req, res) => {
    res.send(req.params.id);
}

exports.uploadStudentList = async (req, res) => {
    try {
        console.log(req.file);
        const readable = new Readable()

        const students = [];
        readable._read = () => { };
        readable.push(req.file.buffer)
        readable.push(null)

        readable
            .pipe(csv.parse({ headers: ["id", "fullName"], renameHeaders: true }))
            .on("error", (error) => {
                res.status(500).send({
                    message: "File format error: " + req.file.originalname,
                });
            })
            .on("data", (row) => {
                students.push(row);
            })
            .on("end", async () => {
                console.log(students);
                try {
                    await StudentRecordsService.resetList();
                    await StudentRecordsService.insertList(students);
                    res.status(200).send({
                        message:
                            "Uploaded the file successfully: " + req.file.originalname,
                    });
                } catch (err) {
                    console.log(err);
                    res.status(500).send({
                        message: "Failed to upload the file: " + req.file.originalname,
                    });
                }

            })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};
