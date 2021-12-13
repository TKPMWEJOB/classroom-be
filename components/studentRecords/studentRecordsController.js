exports.index = async (req, res) =>{
    res.send(req.params.id);
}