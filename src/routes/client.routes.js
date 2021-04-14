import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/client.controller");
const router = Router();
const { authJwt } = require("../middleware");



// Create a new provider
// router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create );

router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);
router.get("/details/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findById);
router.get("/table/:id", [authJwt.verifyToken, authJwt.isModerator], controller.buildTableById);
router.get("/clientForTable/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findClientsForTable);



export default router;