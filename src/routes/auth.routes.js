import { Router } from 'express';


const controller = require("../controllers/auth.controller");
const router = Router();


router.post("/signin", controller.signin);




export default router;
