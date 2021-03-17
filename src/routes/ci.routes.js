import { Router } from 'express';

const db = require("../index.db");
const ci = require("../controllers/ci.controller");
const router = Router();
const { authJwt } = require("../middleware");




// Retrieve all cis
router.post("/", ci.findAll);
router.post("/search", ci.findAllSearch);




export default router;