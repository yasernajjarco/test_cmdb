import { Router } from 'express';

const db = require("../index.db");
const controller = require("../controllers/hardware.controller");
const router = Router();
const { authJwt } = require("../middleware");


/**
 * POST /api/hardwares
 * @tags hardwares
 * @summary Get all hardware elements by filter or not
 * @param {object} request.body.required - ci filter info
 * @return {array<object>} 200 - success response
 * @return {object} 403 - forbidden request response
 * @example request - payload example
 * {
 *    "platform" : "Z",
 *    "type": "pserver",
 *    "subtype":"Mainframe IBM" ,
 *    "columns":["id","name","type","subtype","classService","environnement","nrb_managed_by","status","description","serial_no","platform"]
 * }
 * @example response - 200
 * [
 *   {
 *     "id": 33,
 *       "name": "CEC02",
 *       "type": "pserver",
 *       "subtype": "Mainframe IBM",
 *       "classService": "PAAS",
 *       "environnement": "Production",
 *       "nrb_managed_by": "NRB",
 *       "status": "Operational",
 *       "description": "Z15-401 Mainframe BDC",
 *       "serial_no": "023F6D8",
 *       "platform": "Z"
 *   }
 * ]
 * @example response - 403 - example error response
 * {
 *   "message": "you cannot access to get elements hardwares"
 * }
 */

router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);





/**
 * GET /api/hardwares/{id}
 * @tags hardwares
 * @summary Get a single element with more details based on its id
 * @param {number} id.path
 * @return {object} 200 - success response
 * @return {object} 403 - forbidden request response
 * @example response - 200
 *   {
 *     "id": 1,
 *     "name": "NF0012",
 *     "type": "pserver",
 *     "subtype": "Operational",
 *      "environnement": "Production", 
 *      "status": "Operational",
 *      "description": "Mainframe GCOS8 Hélios 5 / 514 VDC / VDL / SPW DR",
 *      "classService": "PAAS",
 *      "nrb_managed_by": "NRB",
 *      "platform": "B",
 *      "hardwares": [
 * {
 *          "id": 5,
 *           "serial_no": "XAN-SP1-00255",
 *           "description": "Mainframe GCOS8 Hélios 5 / 514 VDC / VDL / SPW DR",
 *           "our_name": "NF0012"
 *         }
 * ],
 *  "clients": [],
 *  "lpars": [
 *  {
 *           "id": 7,
 *           "host_ci": "NF0012",
 *           "description": "Mainframe GCOS8 Hélios 5 / 514 VDC / VDL / SPW DR",
 *           "our_name": "NF0012"
 *       }
 * ]
 *  }
 * @example response - 403 - example error response
 * {
 *   "message": "you cannot access to get details of element hardware"
 * }
 */
router.get("/details/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findById);
router.put("/relation/:id", [authJwt.verifyToken, authJwt.isModerator], controller.addRelation);
router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.update);



export default router;