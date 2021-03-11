const db = require("../index.db");
const Platform = db.platforms;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    //{ include: ["ci"] }
    Platform.findAll({ include: ["providers"] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Platforms."
            });
        });
};

// Create and Save a new Platform
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Platform
    const platform = {
        name: req.body.name
    };

    // Save Platform in the database
    Platform.create(platform)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Platform."
            });
        });
};


// Find a single Platform with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    console.log(id)
    Platform.findOne({ where: { platform_id: id } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Platform with id=" + id
            });
        });
};





// Update a Platform by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Platform.update(req.body, {
            where: { platform_id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Platform was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Platform with id=${id}. Maybe Platform was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Platform with id=" + id
            });
        });
};


// Delete a Platform with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Platform.destroy({
            where: { platform_id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Platform was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Platform with id=${id}. Maybe Platform was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Platform with id=" + id
            });
        });
};