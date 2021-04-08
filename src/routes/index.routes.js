import platform from './platform.routes';
import Auth from './auth.routes';
import User from './user.routes';
import Provider from './provider.routes';
import hardware from './hardware.routes';
import partitions from './partitions.routes';
import systems from './systems.routes';
import zlinux from './zlinux.routes';
import instances from './instances.routes';
import occurences from './occurences.routes';
import clients from './client.routes';
import info from './info.routes';
import table from './tableInstances.routes';


import Ci from './ci.routes';
import App from './app.routes';
import express from 'express';


const router = express.Router();


router.use('/platforms', platform);
router.use('/hardwares', hardware);
router.use('/users', Auth);
router.use('/cis', Ci);


router.use('/partitions', partitions);
router.use('/systems', systems);
router.use('/zlinuxs', zlinux);
router.use('/instances', instances);
router.use('/occurences', occurences);
router.use('/apps', App);

router.use('/providers', Provider);
router.use('/clients', clients);
router.use('/info', info);
//router.use('/table', table);


router.use('/', User); //pour test

export default router;