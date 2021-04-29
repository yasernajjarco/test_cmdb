import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/systems.controller");
const router = Router();
const { authJwt } = require("../middleware");


// Retrieve all cis
router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);
router.get("/details/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findById);

router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.update);

router.put("/:id/partition", [authJwt.verifyToken, authJwt.isModerator], controller.addPartition);
router.delete("/:id/partition", [authJwt.verifyToken, authJwt.isModerator], controller.deletePartition);


router.put("/:id/client", [authJwt.verifyToken, authJwt.isModerator], controller.addClient);
router.delete("/:id/client", [authJwt.verifyToken, authJwt.isModerator], controller.deleteClient);

export default router;