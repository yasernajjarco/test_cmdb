const db = require("../index.db");
const Provider = db.provider;
const Provider_Platform = db.provider_platform;
import { Sequelize } from "sequelize";
import moment from 'moment';
const logger = require('../logger');
let compt = 0;

let results = [];


const reader = require('xlsx')


export async function insert(fileName, namePlatform) {

    const file = reader.readFile(fileName, { cellDates: true })
    let data = new Array();
    const sheets = file.SheetNames
    sheets.forEach((res) => {
        data[res] = new Array();
    })

    logger.info('start processing this file : ', fileName);


    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        data[sheets[i]] = (temp);

        switch (sheets[i]) {

            case 'lserver|Mainframe LPAR':
                compt = 0;
                await insertlserver(temp, namePlatform, 'Mainframe LPAR');
                await insertSystem(temp, namePlatform, 'Mainframe LPAR');

                logger.info(compt, ' virtual of  world  ', namePlatform, ' of type ', sheets[i], ' has been updated or added');

                break;

            case 'lserver|Mainframe LGP':
                await insertlserver(temp, namePlatform, 'Mainframe LGP');
                await insertSystem(temp, namePlatform, 'Mainframe LGP');
                logger.info(compt, ' virtual of  world  ', namePlatform, ' of type ', sheets[i], ' has been updated or added');

                break;

            case 'lserver|zVM Linux':
                await insertzLinux(temp, namePlatform);
                logger.info(compt, ' virtual of  world  ', namePlatform, ' of type ', sheets[i], ' has been updated or added');
                logger.info('end processing this file : ', fileName);

                return await results;
                break;

        }



    }

    logger.info('end processing this file : ', fileName);

}


async function insertlserver(lserver, namePlatform, nameType) {


    for (var i = 1; i < lserver.length; i++) {

        const ciLserver = {
            logicalName: lserver[i]["LOGICAL_NAME"],

            host_ci: lserver[i]["__EMPTY"],
            host_type: lserver[i]["__EMPTY_1"],
            system_ci: lserver[i]["__EMPTY_2"],
            system_ci_subtype: lserver[i]["__EMPTY_3"],



            type: lserver[i]["TYPE"],
            subtype: lserver[i]["SUBTYPE"],
            disblay_name: lserver[i]["DISPLAY_NAME"],
            company: lserver[i]["COMPANY"],
            nrb_managed_by: lserver[i]["NRB_MANAGED_BY"],
            assignment: lserver[i]["ASSIGNMENT"],
            nrb_class_service: lserver[i]["NRB_CLASS_SERVICE"],
            nrb_env_type: (lserver[i]["NRB_ENV_TYPE"]).substring((lserver[i]["NRB_ENV_TYPE"]).lastIndexOf(".") + 1).trim(),
            status: lserver[i]["ISTATUS"],
            description: lserver[i]["DESCRIPTION"],

            unit: lserver[i]["Unit"]
        };


        try {


            const asyncFunction = async() => {
                let step1 = await db.status.findOne({ where: { name: ciLserver.status }, attributes: ['status_id'] });
                ciLserver.status_id = step1.dataValues.status_id;


                step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] })
                ciLserver.platform_id = step1.dataValues.platform_id;

                step1 = await db.classService.findOne({ where: { name: ciLserver.nrb_class_service }, attributes: ['class_service_id'] })
                ciLserver.class_service_id = step1.dataValues.class_service_id;

                step1 = await db.envType.findOne({ where: { name: ciLserver.nrb_env_type }, attributes: ['env_type_id'] })
                ciLserver.env_type_id = step1.dataValues.env_type_id;


                step1 = await db.hardwares.findOne({ include: { model: db.ci, as: 'ci', where: { name: ciLserver.host_ci } } })
                ciLserver.hardware_id = step1.dataValues.hardware_id;

                step1 = await db.ciType.findOne({ where: { name: ciLserver.type }, attributes: ['ci_type_id'] })
                ciLserver.ci_type_id = step1.dataValues.ci_type_id;

                step1 = await db.ciSubtype.findOne({ where: { name: ciLserver.subtype }, attributes: ['ci_subtype_id'] })
                ciLserver.ci_subtype_id = step1.dataValues.ci_subtype_id;


                return ciLserver;


            }



            await asyncFunction().then(async lserver => {

                await db.ci.findOrCreate({
                    where: { logical_name: lserver.logicalName },
                    defaults: {
                        logical_name: lserver.logicalName,
                        our_name: lserver.logicalName,
                        company: lserver.company,
                        nrb_managed_by: lserver.nrb_managed_by,
                        description: lserver.description,
                        platform_id: lserver.platform_id,
                        status_id: lserver.status_id,
                        class_service_id: lserver.class_service_id,
                        ci_subtype_id: lserver.ci_subtype_id,
                        ci_type_id: lserver.ci_type_id,
                        env_type_id: lserver.env_type_id
                    }
                }).then(async function(res) {
                    compt++;
                    await db.lpars.findOrCreate({
                        //  hardware_id: lserver.hardware_id,
                        where: { ci_id: res[0].dataValues.ci_id },
                        defaults: {
                            // host_ci: lserver.host_ci,
                            host_type: lserver.host_type,
                            ci_id: res[0].dataValues.ci_id,
                            hardware_id: lserver.hardware_id
                        }
                    });

                })






            });

        } catch (error) {

            logger.error('can\'t insert virtual ', lserver, 'Error => ', error)


        }




    }


}


async function insertSystem(lserver, namePlatform, nameType) {

    var i = await insertClient(lserver);

    for (var i = 1; i < lserver.length; i++) {

        const ciLserver = {
            logicalName: lserver[i]["LOGICAL_NAME"],

            host_ci: lserver[i]["__EMPTY"],
            host_type: lserver[i]["__EMPTY_1"],
            system_ci: lserver[i]["__EMPTY_2"],
            system_ci_subtype: lserver[i]["__EMPTY_3"],



            type: lserver[i]["TYPE"],
            subtype: lserver[i]["SUBTYPE"],
            disblay_name: lserver[i]["DISPLAY_NAME"],
            company: lserver[i]["COMPANY"],
            nrb_managed_by: lserver[i]["NRB_MANAGED_BY"],
            assignment: lserver[i]["ASSIGNMENT"],
            nrb_class_service: lserver[i]["NRB_CLASS_SERVICE"],
            nrb_env_type: (lserver[i]["NRB_ENV_TYPE"]).substring((lserver[i]["NRB_ENV_TYPE"]).lastIndexOf(".") + 1).trim(),
            status: lserver[i]["ISTATUS"],
            description: lserver[i]["DESCRIPTION"],

            unit: lserver[i]["Unit"]
        };


        try {


            const asyncFunction = async() => {
                let step1 = await db.status.findOne({ where: { name: ciLserver.status }, attributes: ['status_id'] });
                ciLserver.status_id = step1.dataValues.status_id;


                step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] })
                ciLserver.platform_id = step1.dataValues.platform_id;

                step1 = await db.classService.findOne({ where: { name: ciLserver.nrb_class_service }, attributes: ['class_service_id'] })
                ciLserver.class_service_id = step1.dataValues.class_service_id;

                step1 = await db.envType.findOne({ where: { name: ciLserver.nrb_env_type }, attributes: ['env_type_id'] })
                ciLserver.env_type_id = step1.dataValues.env_type_id;

                step1 = await db.client.findOne({ where: { companyname: ciLserver.company }, attributes: ['client_id'] })
                ciLserver.client_id = step1.dataValues.client_id;

                step1 = await db.ciType.findOne({ where: { name: ciLserver.type }, attributes: ['ci_type_id'] })
                ciLserver.ci_type_id = step1.dataValues.ci_type_id;

                step1 = await db.ciSubtype.findOne({ where: { name: ciLserver.system_ci_subtype }, attributes: ['ci_subtype_id'] })
                ciLserver.ci_subtype_id = step1.dataValues.ci_subtype_id;

                step1 = await db.lpars.findOne({
                    include: [{ model: db.ci, as: 'ci', attributes: [], where: { logical_name: ciLserver.logicalName } }],
                })
                ciLserver.lpar_id = step1.dataValues.lpar_id;



                return ciLserver;


            }



            await asyncFunction().then(async lserver => {


                if ((lserver.company === 'SECUREX' && lserver.host_type === 'Secondary') || lserver.host_type === 'Primary') {
                    await db.ci.findOrCreate({
                        where: { logical_name: lserver.system_ci },
                        defaults: {
                            logical_name: lserver.system_ci,
                            our_name: lserver.system_ci,
                            company: lserver.company,
                            nrb_managed_by: lserver.nrb_managed_by,
                            description: lserver.description,
                            platform_id: lserver.platform_id,
                            status_id: lserver.status_id,
                            class_service_id: lserver.class_service_id,
                            ci_subtype_id: lserver.ci_subtype_id,
                            ci_type_id: lserver.ci_type_id,
                            env_type_id: lserver.env_type_id

                        }
                    }).then(async function(res) {

                        await db.systems.findOrCreate({
                            //  hardware_id: lserver.hardware_id,
                            where: { ci_id: res[0].dataValues.ci_id },
                            defaults: {
                                ci_id: res[0].dataValues.ci_id,
                                lpar_id: lserver.lpar_id
                            }
                        }).then(async function(res) {
                            if (lserver.company != 'PROD-NRB') {
                                await db.client_systeme.findOrCreate({
                                    where: {
                                        [db.Op.and]: [{ client_id: lserver.client_id, systeme_id: res[0].dataValues.systeme_id }]
                                    },
                                    defaults: {
                                        client_id: lserver.client_id,
                                        systeme_id: res[0].dataValues.systeme_id

                                    }
                                })
                            }

                        });

                    })
                }



            });

        } catch (error) {

            logger.error('can\'t insert virtual ', lserver, 'Error => ', error)


        }




    }


}



async function insertzLinux(lserver, namePlatform) {

    var i = await insertClient(lserver);

    for (var i = 1; i < lserver.length; i++) {

        const ciLserver = {

            ourname: lserver[i]["__EMPTY"],
            supervisuer: lserver[i]["__EMPTY_1"],



            type: lserver[i]["TYPE"],
            subtype: lserver[i]["SUBTYPE"],
            logicalName: lserver[i]["LOGICAL_NAME"],
            disblay_name: lserver[i]["DISPLAY_NAME"],
            company: lserver[i]["COMPANY"],
            nrb_managed_by: lserver[i]["NRB_MANAGED_BY"],
            assignment: lserver[i]["ASSIGNMENT"],
            nrb_class_service: lserver[i]["NRB_CLASS_SERVICE"],
            nrb_env_type: (lserver[i]["NRB_ENV_TYPE"]).substring((lserver[i]["NRB_ENV_TYPE"]).lastIndexOf(".") + 1).trim(),
            status: lserver[i]["ISTATUS"],
            description: lserver[i]["DESCRIPTION"],

            domaine: lserver[i]["DOMAIN"],
            os_version: lserver[i]["OS_VERSION"],
            cpu_type: lserver[i]["CPU_TYPE"],
            cpu_number: lserver[i]["CPU_NUMBER"],
            physical_mem_total: lserver[i]["PHYSICAL_MEM_TOTAL"],
            console_name: lserver[i]["CONSOLE_NAME"],

        };
        if (ciLserver.company === 'PROD-NRB') {
            results.push(lserver[i])
        }

        // console.log(ciLserver)


        const asyncFunction = async() => {
            let step1 = await db.status.findOne({ where: { name: ciLserver.status }, attributes: ['status_id'] });
            ciLserver.status_id = step1.dataValues.status_id;


            step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] })
            ciLserver.platform_id = step1.dataValues.platform_id;

            step1 = await db.classService.findOne({ where: { name: ciLserver.nrb_class_service }, attributes: ['class_service_id'] })
            ciLserver.class_service_id = step1.dataValues.class_service_id;

            step1 = await db.envType.findOne({ where: { name: ciLserver.nrb_env_type }, attributes: ['env_type_id'] })
            ciLserver.env_type_id = step1.dataValues.env_type_id;


            step1 = await db.ciType.findOne({ where: { name: ciLserver.type }, attributes: ['ci_type_id'] })
            ciLserver.ci_type_id = step1.dataValues.ci_type_id;

            step1 = await db.ciSubtype.findOne({ where: { name: ciLserver.subtype }, attributes: ['ci_subtype_id'] })
            ciLserver.ci_subtype_id = step1.dataValues.ci_subtype_id;

            step1 = await db.client.findOne({ where: { companyname: ciLserver.company }, attributes: ['client_id'] })
            ciLserver.client_id = step1.dataValues.client_id;

            step1 = await db.systems.findOne({
                include: [{ model: db.ci, as: 'ci', attributes: [], where: { logical_name: ciLserver.supervisuer } }],
            })
            ciLserver.systeme_id = step1.dataValues.systeme_id;


            return ciLserver;


        }


        await asyncFunction().then(async lserver => {

            await db.ci.findOrCreate({
                where: { logical_name: lserver.logicalName },
                defaults: {
                    logical_name: lserver.logicalName,
                    name: lserver.logicalName,
                    our_name: lserver.ourname,

                    company: lserver.company,
                    nrb_managed_by: lserver.nrb_managed_by,
                    description: lserver.description,
                    platform_id: lserver.platform_id,
                    status_id: lserver.status_id,
                    class_service_id: lserver.class_service_id,
                    ci_subtype_id: lserver.ci_subtype_id,
                    ci_type_id: lserver.ci_type_id,
                    env_type_id: lserver.env_type_id
                }
            }).then(async function(res) {

                await db.zLinux.findOrCreate({
                    where: { ci_id: res[0].dataValues.ci_id },
                    defaults: {
                        ci_id: res[0].dataValues.ci_id,
                        domaine: lserver.domaine,
                        os_version: lserver.os_version,
                        cpu_type: lserver.cpu_type,
                        cpu_number: lserver.cpu_number,
                        physical_mem_total: lserver.physical_mem_total,
                        systeme_id: lserver.systeme_id,


                    }
                }).then(async function(res) {
                    await db.client_zlinux.findOrCreate({
                        where: {
                            [db.Op.and]: [{ client_id: ciLserver.client_id, zlinux_id: res[0].dataValues.zlinux_id }]
                        },
                        defaults: {
                            client_id: ciLserver.client_id,
                            zlinux_id: res[0].dataValues.zlinux_id

                        }
                    })


                });


            })



        });

    }


}

async function insertClient(apps) {
    for (var i = 1; i < apps.length; i++) {
        const occu = { company: apps[i]["COMPANY"] };

        await db.client.findOrCreate({
            where: { companyname: occu.company },
            defaults: {
                companyname: occu.company,
            }
        });

    }
    return i;
}


/* .then(async function(res) {
    if (lserver.company != 'PROD-NRB') {
        await db.client_systeme.findOrCreate({
            where: {
                [db.Op.and]: [{ client_id: lserver.client_id, systeme_id: res[0].dataValues.systeme_id }]
            },
            defaults: {
                client_id: lserver.client_id,
                systeme_id: res[0].dataValues.systeme_id

            }
        })
    }

}); */