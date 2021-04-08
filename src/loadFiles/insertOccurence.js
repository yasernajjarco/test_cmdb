const db = require("../index.db");
import moment from 'moment';
const logger = require('../logger');
let compt = 0;
var fs = require('fs')
const path = require('path');

const reader = require('xlsx')


let results = [];

export async function insert(fileName, namePlatform) {

    const file = reader.readFile(fileName, { type: "string", cellDates: false })
    let data = new Array();
    const sheets = file.SheetNames
    sheets.forEach((res) => {
        data[res] = new Array();
    })

    logger.info('start processing this file : ', fileName);


    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]], {
            raw: false,
        })
        data[sheets[i]] = (temp);

        switch (sheets[i]) {
            case 'occurence|Mainframe Subsystem':
                await insertOccurences(temp, namePlatform);
                logger.info(compt, ' occurrences of  world  ', namePlatform, ' has been updated or added');
                logger.info('end processing this file : ', fileName);
                return await results;
                break;
        }

    }





}


async function insertOccurences(apps, namePlatform) {


    var i = await insertClient(apps);
    for (var i = 1; i < apps.length; i++) {



        const occu = {
            ourName: apps[i]["__EMPTY"],
            product_code: (apps[i]["APPLICATION"]).substring(apps[i]["APPLICATION"].indexOf(' ') + 1, apps[i]["APPLICATION"].lastIndexOf(' ')),
            version: (apps[i]["APPLICATION"]).substring(apps[i]["APPLICATION"].lastIndexOf(' ') + 1).trim(),

            softinstance: apps[i]["__EMPTY_2"],
            system: apps[i]["NETWORK_NAME"].trim(),
            type: apps[i]["TYPE"],
            subtype: apps[i]["SUBTYPE"],
            logicalname: apps[i]["LOGICAL_NAME"],
            displayName: apps[i]["DISPLAY_NAME"],
            company: apps[i]["COMPANY"],
            nrb_managed_by: apps[i]["NRB_MANAGED_BY"],
            asignment: apps[i]["ASSIGNMENT"],
            status: apps[i]["ISTATUS"],
            description: apps[i]["DESCRIPTION"],


        };

        if (occu.company === 'PROD-NRB') {
            results.push(apps[i])
        }

        try {

            const asyncFunction = async() => {

                let step1 = null;
                if (occu.company !== 'PROD-NRB') {

                    step1 = await db.client.findOne({ where: { companyname: occu.company }, attributes: ['client_id'] })
                    occu.client_id = step1.dataValues.client_id;

                }
                step1 = await db.instance.findOne({ where: { name: occu.softinstance }, attributes: ['instance_id'] })
                occu.instance_id = step1.dataValues.instance_id;

                step1 = await db.application.findOne({ where: { product_code: occu.product_code, version: occu.version }, attributes: ['ci_application_id'] })
                occu.ci_application_id = step1.dataValues.ci_application_id;

                step1 = await db.status.findOne({ where: { name: occu.status }, attributes: ['status_id'] });
                occu.status_id = step1.dataValues.status_id;


                step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] })
                occu.platform_id = step1.dataValues.platform_id;


                step1 = await db.ciType.findOne({ where: { name: occu.type }, attributes: ['ci_type_id'] })
                occu.ci_type_id = step1.dataValues.ci_type_id;

                step1 = await db.ciSubtype.findOne({ where: { name: occu.subtype }, attributes: ['ci_subtype_id'] })
                occu.ci_subtype_id = step1.dataValues.ci_subtype_id;

                return occu;

            }

            await asyncFunction().then(async app => {

                await db.ci.findOrCreate({
                    where: { name: app.logicalname },
                    defaults: {
                        name: app.logicalname,
                        our_name: app.ourName,

                        logical_name: app.logicalname,
                        company: app.company,
                        nrb_managed_by: app.nrb_managed_by,
                        description: app.description,
                        platform_id: app.platform_id,
                        status_id: app.status_id,
                        ci_subtype_id: app.ci_subtype_id,
                        ci_type_id: app.ci_type_id,

                    }
                }).then(async function(res) {
                    compt++;
                    await db.occurence.findOrCreate({
                        where: { name: app.logicalname },
                        defaults: {
                            our_name: app.ourName,
                            name: app.logicalname,
                            instance_id: app.instance_id,
                            //client_id: app.client_id,
                            ci_id: res[0].dataValues.ci_id,

                        }
                    }).then(async function(res) {
                        if (app.company !== 'PROD-NRB') {
                            await db.occurence_client.findOrCreate({
                                where: {
                                    [db.Op.and]: [{ client_id: app.client_id, occurencesoft_id: res[0].dataValues.occurencesoft_id }]
                                },
                                defaults: {
                                    client_id: app.client_id,
                                    occurencesoft_id: res[0].dataValues.occurencesoft_id

                                }
                            })
                        }



                    });

                });

                await db.application.update({ isoccurenciable: 1 }, { where: { ci_application_id: occu.ci_application_id } });



            });

        } catch (error) {
            logger.error('can\'t insert occurence ', occu)

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
}