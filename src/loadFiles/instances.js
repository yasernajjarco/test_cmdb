const db = require("../index.db");
import moment from 'moment';
import ConsoleAppender from 'simple-node-logger/lib/ConsoleAppender';
const logger = require('../logger');
let compt = 0;
let results = [];

//zVM linux, occurence linux all sauf PROD-NRB

const reader = require('xlsx')


export async function insertInstances(fileName, namePlatform) {

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
            case 'sinstance|Mainframe Software':
                await insertInstance(temp, namePlatform);
                logger.info(compt, ' instances of  world  ', namePlatform, ' has been updated or added');

                logger.info('end processing this file : ', fileName);
                return await results;

                break;
        }

    }



}


async function insertInstance(instances, namePlatform) {

    var i = await insertClient(instances);

    for (var i = 1; i < instances.length; i++) {



        const instance = {
            ourName: instances[i]["__EMPTY"],
            product_code: (instances[i]["APPLICATION"]).substring(instances[i]["APPLICATION"].indexOf(' ') + 1, instances[i]["APPLICATION"].lastIndexOf(' ')),
            version: (instances[i]["APPLICATION"]).substring(instances[i]["APPLICATION"].lastIndexOf(' ') + 1).trim(),
            system: instances[i]["NETWORK_NAME"].trim(),
            type: instances[i]["TYPE"],
            subtype: instances[i]["SUBTYPE"],
            logicalname: instances[i]["LOGICAL_NAME"],
            displayName: instances[i]["DISPLAY_NAME"],
            company: instances[i]["COMPANY"],
            nrb_managed_by: instances[i]["NRB_MANAGED_BY"],
            asignment: instances[i]["ASSIGNMENT"],
            status: instances[i]["ISTATUS"],
            description: instances[i]["DESCRIPTION"],


        };

        if (instance.company === 'PROD-NRB') {
            results.push(instances[i])
        }

        try {

            const asyncFunction = async() => {

                let step1 = await db.status.findOne({ where: { name: instance.status }, attributes: ['status_id'] });
                instance.status_id = step1.dataValues.status_id;


                step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] })
                instance.platform_id = step1.dataValues.platform_id;


                step1 = await db.ciType.findOne({ where: { name: instance.type }, attributes: ['ci_type_id'] })
                instance.ci_type_id = step1.dataValues.ci_type_id;

                step1 = await db.ciSubtype.findOne({ where: { name: instance.subtype }, attributes: ['ci_subtype_id'] })
                instance.ci_subtype_id = step1.dataValues.ci_subtype_id;

                step1 = await db.systems.findOne({
                    include: [{ model: db.ci, as: 'ci', attributes: [], where: { logical_name: instance.system } }],
                })
                instance.systeme_id = step1.dataValues.systeme_id;

                step1 = await db.application.findOne({ where: { product_code: instance.product_code, version: instance.version }, attributes: ['ci_application_id'] })
                instance.ci_application_id = step1.dataValues.ci_application_id;

                step1 = await db.client.findOne({ where: { companyname: instance.company }, attributes: ['client_id'] })
                instance.client_id = step1.dataValues.client_id;

                return instance;

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
                    await db.instance.findOrCreate({
                            where: { name: app.logicalname },
                            defaults: {
                                name: app.logicalname,
                                ci_application_id: app.ci_application_id,
                                systeme_id: app.systeme_id,
                                ci_id: res[0].dataValues.ci_id,
                                // isoccurenciable: 1,

                            }

                        })
                        /*                     .then(async function(res) {
                                                await db.instance_client.findOrCreate({
                                                    where: {
                                                        [db.Op.and]: [{ client_id: app.client_id, instance_id: res[0].dataValues.instance_id }]
                                                    },
                                                    defaults: {
                                                        client_id: app.client_id,
                                                        instance_id: res[0].dataValues.instance_id

                                                    }
                                                })


                                            }); */

                });


            });
        } catch (error) {
            logger.error('can\'t insert instance ', instance)

        }



    }


    async function insertClient(clients) {
        for (var i = 1; i < clients.length; i++) {
            const element = { company: clients[i]["COMPANY"] };

            await db.client.findOrCreate({
                where: { companyname: element.company },
                defaults: {
                    companyname: element.company,
                }
            });

        }
        return i;
    }
}