import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/hardware.controller");
const router = Router();
const { authJwt } = require("../middleware");


// Retrieve all cis
router.post("/", controller.findAll);



export default router;