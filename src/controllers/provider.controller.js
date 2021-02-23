const db = require("../index.db");
const Provider = db.provider;
const Op = db.Sequelize.Op;

  // Create a Platform
  const provider = {
    name: req.body.name
  };

  // Save Platform in the database
  Provider.create(provider)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Platform."
      });
    });

  






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
