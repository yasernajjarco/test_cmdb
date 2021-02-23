import platform from './platform.routes';
import Auth from './auth.routes';
import User from './user.routes';
import Ci from './ci.routes';
import express from 'express';
const router = express.Router();


router.use('/platforms', platform);
router.use('/users', Auth);
router.use('/cis', Ci);

router.use('/', User);  //pour test

export default router;
