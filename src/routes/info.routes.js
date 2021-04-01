import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/info.controller");
const router = Router();
const { authJwt } = require("../middleware");



// Create a new provider
// router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create );


// Retrieve all provider
router.get("/status/", [authJwt.verifyToken, authJwt.isModerator], controller.findStatus);
router.get("/platforms/", [authJwt.verifyToken, authJwt.isModerator], controller.findPlatforms);
router.get("/classeServices/", [authJwt.verifyToken, authJwt.isModerator], controller.findClasseServices);
router.get("/environments/", [authJwt.verifyToken, authJwt.isModerator], controller.findEnvironment);



export default router;