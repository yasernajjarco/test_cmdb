import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/app.controller");
const router = Router();
const { authJwt } = require("../middleware");




// Retrieve all cis
router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);
router.get("/details/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findById);

router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.update);

router.put("/:id/provider", [authJwt.verifyToken, authJwt.isModerator], controller.addProvider);

export default router;