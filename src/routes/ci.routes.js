import { Router } from 'express';

const db = require("../index.db");
const ci = require("../controllers/ci.controller");
const router = Router();
const { authJwt } = require("../middleware");





/**
 * POST /api/cis
 * @tags CI
 * @summary Make a search query based on a CI name
 * @param {object} request.body.required - ci name 
 * @return {array<object>} 200 - success response
 * @return {object} 403 - forbidden request response
 * @example request - payload example
 * {
 *    "name" : "CEC0"
 * }
 * @example response - 200
 * [
 *   {
 *      "id": 33,
 *       "name": "CEC02",
 *       "type": "pserver",
 *       "subtype": "Mainframe IBM"
 *   },
 *   {
 *     "id": 34,
 *       "name": "CEC05",
 *       "type": "pserver",
 *       "subtype": "Mainframe IBM"
 *   }
 * ]
 * @example response - 403 - example error response
 * {
 *   "message": "you cannot access to search data"
 * }
 */
router.post("/", [authJwt.verifyToken, authJwt.isModerator], ci.findAll);
//router.post("/search", [authJwt.verifyToken, authJwt.isModerator], ci.findAllSearch);




export default router;