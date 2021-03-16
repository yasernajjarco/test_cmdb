import { Router } from 'express';

const db = require("../index.db");
const ci = require("../controllers/ci.controller");
const router = Router();
const { authJwt } = require("../middleware");




// Retrieve all cis
router.get("/", ci.findAll);
router.get("/search", ci.findAllSearch);




export default router;