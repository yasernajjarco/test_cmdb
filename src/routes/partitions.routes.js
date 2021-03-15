import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/partitions.controller");
const router = Router();
const { authJwt } = require("../middleware");


// Retrieve all cis
router.get("/", controller.findAll);



export default router;