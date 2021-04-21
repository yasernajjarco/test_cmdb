import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/partitions.controller");
const router = Router();
const { authJwt } = require("../middleware");


// Retrieve all cis
router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);
router.get("/details/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findById);

router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.update);

/* router.put("/:id/system", [authJwt.verifyToken, authJwt.isModerator], controller.addSystem);
router.delete("/:id/system", [authJwt.verifyToken, authJwt.isModerator], controller.deleteSystem);

router.put("/:id/hardware", [authJwt.verifyToken, authJwt.isModerator], controller.addHardware);
router.delete("/:id/hardware", [authJwt.verifyToken, authJwt.isModerator], controller.deleteHardware); */



export default router;