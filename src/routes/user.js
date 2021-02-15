import { Router } from 'express';
const db = require("../models_test/index");
const person = require("../controllers/person.controller");


const Oders = db.orders;
const router = Router();




router.post("/", person.create);

router.get('/', (req, res) => {

  Oders.findAll({ include: ["persons"] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
});

  








router.get('/:userId', (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

export default router;
