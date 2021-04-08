const db = require("../index.db");
const Provider = db.provider;
const Provider_Platform = db.provider_platform;
import { Sequelize } from "sequelize";
import moment from 'moment';
const csv = require('csv-parser');
const fs = require('fs');
const logger = require('../logger');
let compt = 0;


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

        compt = 0;
        await insertpserver(temp, namePlatform);
        logger.info(compt, ' hardwares of  world  ', namePlatform, ' of type ', sheets[i], ' has been updated or added');

    }


    logger.info('end processing this file : ', fileName);


}


async function insertpserver(pservers, namePlatform) {

    await insertClient(pservers);


    for (var i = 1; i < pservers.length; i++) {

        const ciPserver = {

            our_name: pservers[i]["__EMPTY"],
            type: pservers[i]["TYPE"],
            subtype: pservers[i]["SUBTYPE"],
            disblay_name: pservers[i]["DISPLAY_NAME"],
            company: pservers[i]["COMPANY"],
            nrb_managed_by: pservers[i]["NRB_MANAGED_BY"],
            assignment: pservers[i]["ASSIGNMENT"],
            nrb_class_service: pservers[i]["NRB_CLASS_SERVICE"],
            status: pservers[i]["ISTATUS"],
            description: pservers[i]["DESCRIPTION"],
            serial_no: pservers[i]["SERIAL_NO"],

        };

        try {

            if (ciPserver.serial_no !== undefined) {

                ciPserver.nrb_env_type = (pservers[i]["NRB_ENV_TYPE"]).substring((pservers[i]["NRB_ENV_TYPE"]).lastIndexOf(".") + 1).trim();


                const asyncFunction = async() => {
                    let step1 = await db.status.findOne({ where: { name: ciPserver.status }, attributes: ['status_id'] });
                    ciPserver.status_id = step1.dataValues.status_id;


                    step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] })
                    ciPserver.platform_id = step1.dataValues.platform_id;

                    if (ciPserver.company !== 'PROD-NRB') {
                        step1 = await db.client.findOne({ where: { companyname: ciPserver.company }, attributes: ['client_id'] })
                        ciPserver.client_id = step1.dataValues.client_id;
                    }



                    step1 = await db.classService.findOne({ where: { name: ciPserver.nrb_class_service }, attributes: ['class_service_id'] })
                    ciPserver.class_service_id = step1.dataValues.class_service_id;

                    step1 = await db.envType.findOne({ where: { name: ciPserver.nrb_env_type }, attributes: ['env_type_id'] })
                    ciPserver.env_type_id = step1.dataValues.env_type_id;

                    step1 = await db.ciType.findOne({ where: { name: ciPserver.type }, attributes: ['ci_type_id'] })
                    ciPserver.ci_type_id = step1.dataValues.ci_type_id;

                    step1 = await db.ciSubtype.findOne({ where: { name: ciPserver.subtype }, attributes: ['ci_subtype_id'] })
                    ciPserver.ci_subtype_id = step1.dataValues.ci_subtype_id;


                    return ciPserver;



                }



                await asyncFunction().then(async ciHardware => {

                    await db.ci.findOrCreate({
                        where: { name: ciHardware.our_name },
                        defaults: {

                            name: ciHardware.our_name,
                            our_name: ciHardware.our_name,

                            company: ciHardware.company,
                            nrb_managed_by: ciHardware.nrb_managed_by,
                            description: ciHardware.description,
                            platform_id: ciHardware.platform_id,
                            status_id: ciHardware.status_id,
                            class_service_id: ciHardware.class_service_id,
                            ci_subtype_id: ciHardware.ci_subtype_id,
                            ci_type_id: ciHardware.ci_type_id,
                            env_type_id: ciHardware.env_type_id

                        }
                    }).then(async function(res) {
                        compt++;
                        await db.hardwares.findOrCreate({
                            where: { serial_no: ciHardware.serial_no },
                            defaults: {
                                serial_no: ciHardware.serial_no,
                                ci_id: res[0].dataValues.ci_id
                            }
                        }).then(async function(res) {
                            // && (ciHardware.nrb_class_service === 'Housing' && ciHardware.client_id != null) || (ciHardware.type === 'storage'))
                            if (ciHardware.company !== 'PROD-NRB') {
                                await db.client_hardware.findOrCreate({
                                    where: {
                                        [db.Op.and]: [{ client_id: ciHardware.client_id, hardware_id: res[0].dataValues.hardware_id }]
                                    },
                                    defaults: {
                                        client_id: ciHardware.client_id,
                                        hardware_id: res[0].dataValues.hardware_id,
                                    }
                                })
                            }

                        });


                    });



                });
            }

        } catch (error) {
            logger.error('can\'t insert hardware ', ciPserver, ' =>', error)

        }

    }
}


async function insertClient(apps) {
    for (var i = 1; i < apps.length; i++) {
        const occu = { company: apps[i]["COMPANY"] };
        if (occu.company !== undefined && occu.company != 'PROD-NRB') {
            await db.client.findOrCreate({
                where: { companyname: occu.company },
                defaults: {
                    companyname: occu.company,
                }
            });
        }

    }
    return i;
}

export async function insertRelation(fileName, namePlatform) {
    logger.info('start processing this file : ', fileName);

    extractData(fileName).then(async data => {

        await Object.keys(data).forEach(async function(key, index) {
            let step1;

            const asyncFunction = async() => {

                step1 = await db.hardwares.findOne({ include: { model: db.ci, as: 'ci', where: { name: key } } })



                for (let index = 0; index < data[key].length; index++) {

                    try {
                        let step2 = await db.hardwares.findOne({ include: { model: db.ci, as: 'ci', where: { name: data[key][index] } } });

                        await db.hardwares_relations.findOrCreate({
                            where: { hardware_id: step1.dataValues.hardware_id, hardware_id_1: step2.dataValues.hardware_id },
                            defaults: {
                                hardware_id: step1.dataValues.hardware_id,
                                hardware_id_1: step2.dataValues.hardware_id

                            }
                        });
                    } catch (error) {
                        logger.error('can\'t find referenced for relation ', key, ' X ', data[key][index], ' to insert in the table (hardwares_relations)')

                    }


                }


            }


            await asyncFunction();



        });



    });
    logger.info('end processing this file : ', fileName);

}


function extractData(fileName) {
    return new Promise(function(resolve, reject) {
        const results = [];
        let firstColone = [];
        fs.createReadStream(fileName)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async() => {

                let key = Object.keys(results[0])[0];
                let val = key.substring(key.indexOf(';') + 1);
                let firstLine = val.split(';');
                var i, j;
                for (i = 0; i < results.length; i++) {
                    let line = results[i][key];
                    if (line !== undefined) {
                        let key = line.substring(0, line.indexOf(';'));

                        firstColone[key] = line.substring(line.indexOf(';') + 1).split(';');

                        for (j = 0; j < firstColone[key].length; j++) {
                            if (firstColone[key][j] === 'X') {
                                firstColone[key][j] = firstLine[j];
                            }
                        }

                        firstColone[key] = firstColone[key].filter(item => !(item.replace(/\s/g, "") === ''));

                    }

                }

                resolve(firstColone);

            });

    });

}