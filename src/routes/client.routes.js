import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/client.controller");
const router = Router();
const { authJwt } = require("../middleware");



// Create a new provider
// router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create );

router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);
router.get("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findById);



export default router;