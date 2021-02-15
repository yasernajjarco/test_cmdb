const db = require("../models_test/index");
const Person = db.persons;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.lastname) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const person = {
    LastName: req.body.lastname,
    FirstName : req.body.firstname,
    Age : req.body.age
  };

  console.log(person);

  // Save Tutorial in the database
  Person.create(person)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

