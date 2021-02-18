import { Router } from 'express';

const db = require("../index.db");
const platform = require("../controllers/platform.controller");
const router = Router();
const { authJwt } = require("../middleware");



  // Create a new Platform
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], platform.create );


  // Retrieve all Platform
  router.get("/", platform.findAll);

  // Retrieve a single Platform with id
  router.get("/:id", platform.findOne);

  // Update a Platform with id
  router.put("/:id", platform.update);

  // Delete a Platform with id
  router.delete("/:id", platform.delete);



export default router;
