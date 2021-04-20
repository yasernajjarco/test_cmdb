const db = require("../index.db");
const logger = require('../logger');
let compt = 0;
const { Sequelize, DataTypes, Op } = require("sequelize");
const reader = require('xlsx')


export async function insertApplication(fileName, namePlatform) {

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
            case 'application|Mainframe Software':
                await insertApplications(temp, namePlatform);
                break;
        }

    }
    logger.info(compt, ' softs of  world  ', namePlatform, ' has been updated or added');

    logger.info('end processing this file : ', fileName);


}

async function insertApplications(apps, namePlatform) {

    for (var i = 1; i < apps.length; i++) {

        const app = {
            our_name: apps[i]["__EMPTY"],
            vendor_code: apps[i]["__EMPTY_1"],
            product_code: apps[i]["__EMPTY_2"],
            version: apps[i]["VERSION"],
            type: apps[i]["TYPE"],
            subtype: apps[i]["SUBTYPE"],
            logicalname: apps[i]["LOGICAL_NAME"],
            displayName: apps[i]["DISPLAY_NAME"],
            company: apps[i]["COMPANY"],
            nrb_managed_by: apps[i]["NRB_MANAGED_BY"],
            asignment: apps[i]["ASSIGNMENT"],
            status: apps[i]["ISTATUS"],
            description: apps[i]["DESCRIPTION"],
            vendor: apps[i]["VENDOR"],
            itservice: apps[i]["__EMPTY_4"],

            end_of_support_date: apps[i]["END_OF_SUPPORT_DATE"],
            end_of_extend_date: apps[i]["END_EXTENDED_SUPPORT"]

        };


        try {

            const asyncFunction = async() => {
                let step1 = await db.status.findOne({ where: { name: app.status }, attributes: ['status_id'] });
                app.status_id = step1.dataValues.status_id;

                step1 = await db.provider.findOne({ where: { vendor_code: app.vendor_code }, attributes: ['provider_id'] })
                app.provider_id = step1.dataValues.provider_id;

                step1 = await db.platforms.findOne({ where: { name: namePlatform }, attributes: ['platform_id'] })
                app.platform_id = step1.dataValues.platform_id;




                step1 = await db.ciType.findOne({ where: { name: app.type }, attributes: ['ci_type_id'] })
                app.ci_type_id = step1.dataValues.ci_type_id;

                step1 = await db.ciSubtype.findOne({ where: { name: app.subtype }, attributes: ['ci_subtype_id'] })
                app.ci_subtype_id = step1.dataValues.ci_subtype_id;

                return app;

            }

            await asyncFunction().then(async app => {


                await db.ci.findOrCreate({

                    where: { logical_name: app.logicalname },
                    defaults: {
                        name: app.product_code,
                        logical_name: app.logicalname,
                        company: app.company,
                        nrb_managed_by: app.nrb_managed_by,
                        description: app.description,
                        platform_id: app.platform_id,
                        status_id: app.status_id,
                        ci_subtype_id: app.ci_subtype_id,
                        ci_type_id: app.ci_type_id,
                        our_name: app.our_name
                    }
                }).then(async function(res) {

                    if (res[0]._options.isNewRecord) {
                        db.audit.create({
                            audittimestamp: Sequelize.fn('NOW'),
                            audituser: 'auto',
                            auditdescription: 'initial loading',
                            ci_id: res[0].dataValues.ci_id
                        })
                    }

                    compt++;
                    await db.application.findOrCreate({
                        where: { product_code: app.product_code, version: app.version },
                        defaults: {
                            itservice: app.itservice,
                            product_code: app.product_code,
                            version: app.version,
                            is_valid: 1,
                            end_of_support_date: app.end_of_support_date,
                            end_extended_support: app.end_of_extend_date,
                            provider_id: app.provider_id,
                            ci_id: res[0].dataValues.ci_id
                        }

                    });


                });



            });
        } catch (error) {
            logger.error('can\'t insert soft ', app, 'Error => ', error)

        }



    }

}