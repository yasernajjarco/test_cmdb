import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/app.controller");
const router = Router();
const { authJwt } = require("../middleware");



 
  // Retrieve all cis
  router.get("/", controller.findAll);
  router.get("/:id", controller.findByIdProvider);

  router.post("/", controller.findByIdPlatform);


export default router;
