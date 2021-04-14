import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/instances.controller");
const router = Router();
const { authJwt } = require("../middleware");


// Retrieve all cis
router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);
router.get("/details/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findById);




export default router;