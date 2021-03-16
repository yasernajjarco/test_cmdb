import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/systems.controller");
const router = Router();
const { authJwt } = require("../middleware");


// Retrieve all cis
router.get("/", controller.findAll);
router.get("/linux", controller.findLinux);



export default router;