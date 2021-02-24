const db = require("../index.db");
const Provider = db.provider;
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require("sequelize");



exports.findAll = (req, res) => {
  // const title = req.query.title;
  // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
 //{ include: ["application"] }
 Provider.findAll()
     .then(data => {
       res.send(data);
     })
     .catch(err => {
       res.status(500).send({
         message:
           err.message || "Some error occurred while retrieving Platforms."
       });
     });
 };
 
  
 exports.findByPlatform = (req, res) => {
  // const title = req.query.title;
  // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
 //{ include: ["application"] }
 const id = req.params.id;

 Provider.findAll({ 
   include: [{ model: db.platforms, as: 'platforms' , where: { platform_id: id }, attributes: ['platform_id'] 
  }]} )
     .then(data => {
       res.send(data);
     })
     .catch(err => {
       res.status(500).send({
         message:
           err.message || "Some error occurred while retrieving Platforms."
       });
     });
 };


// Update a Provider by the id in the request
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
          message: `Cannot update Provider with id=${id}. Maybe Provider was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Provider with id=" + id
      });
    });
};


// Delete a Provider with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Platform.destroy({
    where: { platform_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Provider was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Provider with id=${id}. Maybe Provider was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Provider with id=" + id
      });
    });
};