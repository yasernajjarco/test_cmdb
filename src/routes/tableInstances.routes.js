import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/tableInstances.controller");
const router = Router();
const { authJwt } = require("../middleware");



// Create a new provider
// router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create );

router.get("/", [authJwt.verifyToken, authJwt.isModerator], controller.findClientsForTable);
router.get("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.buildTableById);




export default router;