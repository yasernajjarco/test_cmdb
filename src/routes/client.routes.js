import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/client.controller");
const router = Router();
const { authJwt } = require("../middleware");



// Create a new provider
// router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create );


// Retrieve all provider
router.post("/", controller.findAll);

// Retrieve a single provider with id
router.get("/:id", controller.findById);



export default router;