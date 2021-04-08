const db = require("./index.db");
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const { Sequelize, DataTypes, Op } = require("sequelize");
const prfixeTest = 'test ';
const utils = require("./controllers/utils");

export async function start() {


    await generateInstances();

    // await generateOccurences();

};


async function generateInstances() {
    await db.platforms.findAll().map(data => data.toJSON()).then(platforms => {
        platforms.forEach(one => {
            let platform = one.name;
            let condition = (platform !== undefined) ? { '$ci.platforms.name$': platform } : {};
            db.instance.findAll({
                    where: condition,
                    include: [{
                            model: db.ci,
                            required: false,
                            as: 'ci',
                            attributes: [],
                            include: [
                                { model: db.platforms, required: false, as: 'platforms', attributes: [] },
                                { model: db.status, required: false, as: 'status', attributes: [], },
                                { model: db.classService, required: false, as: 'classService', attributes: [], },
                                { model: db.ciType, required: false, as: 'ciType', attributes: [], },
                                { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [], },
                                { model: db.envType, required: false, as: 'envType', attributes: [] },



                            ]
                        },
                        {
                            model: db.application,
                            required: false,
                            as: 'application',
                            include: [{
                                model: db.ci,
                                required: false,
                                include: [
                                    { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [], },
                                    { model: db.ciType, required: false, as: 'ciType', attributes: [] },

                                ],
                                as: 'ci',
                            }],
                            attributes: []
                        },

                        {
                            model: db.systems,
                            required: false,
                            as: 'systems',
                            attributes: ['systeme_id'],
                            include: [{
                                model: db.ci,
                                required: false,
                                as: 'ci',
                                include: [
                                    { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [], },
                                    { model: db.ciType, required: false, as: 'ciType', attributes: [] },

                                ],
                                attributes: []
                            }],
                        },
                    ],
                    attributes: [
                        ['instance_id', 'id'],
                        [Sequelize.col('ci.our_name'), '__EMPTY'],
                        [Sequelize.col('application.ci.our_name'), 'APPLICATION'],
                        [Sequelize.col('systems.ci.our_name'), 'NETWORK_NAME'],
                        [Sequelize.col('ci.ciType.name'), 'TYPE'],
                        [Sequelize.col('ci.ciSubtype.name'), 'SUBTYPE'],
                        [Sequelize.col('ci.logical_name'), 'LOGICAL_NAME'],
                        [Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.prefixe"), '_', Sequelize.col("ci.our_name")), 'DISPLAY_NAME'],

                        // [Sequelize.col('ci.nrb_managed_by'), 'COMPANY'],


                        [Sequelize.col('ci.nrb_managed_by'), 'NRB_MANAGED_BY'],

                        [Sequelize.fn('CONCAT', 'GCOS'), 'ASSIGNMENT'],
                        [Sequelize.col('ci.status.name'), 'ISTATUS'],
                        [Sequelize.col('ci.description'), 'DESCRIPTION'],

                    ]
                }).map(data => data.toJSON())
                .then(async data => {

                    let result = [];
                    data.forEach(element => {
                        result.push(setCompanyInstance(element))
                    })
                    Promise.all(result)
                        .then(result => {
                            let pathFile = path.resolve(__dirname, 'Exported files/', prfixeTest + 'CI sinstance ' + platform + '.xlsx')
                            generateFiles('sinstance|Mainframe Software', pathFile, result)
                        })


                }).catch(err => {
                    console.log(err)
                });
        })
    })

}

async function generateOccurences() {
    await db.platforms.findAll().map(data => data.toJSON()).then(platforms => {
        platforms.forEach(one => {
            let platform = one.name;
            let condition = (platform !== undefined) ? { '$ci.platforms.name$': platform } : {};
            db.occurence.findAll({
                    where: condition,
                    include: [{
                            model: db.ci,
                            required: false,
                            as: 'ci',
                            attributes: [],
                            include: [
                                { model: db.platforms, required: false, as: 'platforms', attributes: [] },
                                { model: db.status, required: false, as: 'status', attributes: [], },
                                { model: db.classService, required: false, as: 'classService', attributes: [], },
                                { model: db.ciType, required: false, as: 'ciType', attributes: [], },
                                { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [], },
                                { model: db.envType, required: false, as: 'envType', attributes: [] },



                            ]
                        },
                        {
                            model: db.instance,
                            required: false,
                            as: 'instance',
                            include: [{
                                    model: db.ci,
                                    required: false,
                                    include: [
                                        { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [], },
                                        { model: db.ciType, required: false, as: 'ciType', attributes: [] },
                                        { model: db.status, required: false, as: 'status', attributes: [] },

                                    ],
                                    as: 'ci',
                                },
                                { model: db.application, required: false, as: 'application', include: [{ model: db.ci, required: false, as: 'ci', }], attributes: [] },
                                { model: db.systems, required: false, as: 'systems', include: [{ model: db.ci, required: false, as: 'ci', }], attributes: [] },


                            ],
                            attributes: []
                        }
                    ],
                    attributes: [
                        ['occurencesoft_id', 'id'],
                        [Sequelize.col('ci.our_name'), '__EMPTY'],
                        [Sequelize.col('instance.application.ci.logical_name'), 'APPLICATION'],
                        [Sequelize.col('instance.systems.ci.logical_name'), 'NETWORK_NAME'],
                        [Sequelize.col('ci.ciType.name'), 'TYPE'],
                        [Sequelize.col('ci.ciSubtype.name'), 'SUBTYPE'],
                        [Sequelize.col('ci.logical_name'), 'LOGICAL_NAME'],
                        [Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.prefixe"), '_', Sequelize.col("ci.our_name")), 'DISPLAY_NAME'],
                        [Sequelize.col('ci.nrb_managed_by'), 'NRB_MANAGED_BY'],
                        [Sequelize.fn('CONCAT', 'GCOS'), 'ASSIGNMENT'],
                        [Sequelize.col('ci.status.name'), 'ISTATUS'],
                        [Sequelize.col('ci.description'), 'DESCRIPTION'],

                    ]
                }).map(data => data.toJSON())
                .then(async data => {

                    let result = [];
                    data.forEach(element => result.push(setCompanyOccurence(element)))
                    Promise.all(result)
                        .then(result => {
                            let pathFile = path.resolve(__dirname, 'Exported files/', prfixeTest + 'CI software ' + platform + '.xlsx')
                            generateFiles('occurence|Mainframe Subsystem', pathFile, result)
                        })


                }).catch(err => {
                    console.log(err)
                });
        })
    })
}

function generateFiles(nameSheet, pathFile, data) {


    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    XLSX.writeFile(wb, pathFile);

}

async function setCompanyInstance(element) {
    return await new Promise(async function(resolve) {
        await db.systems.findAll({
            where: { systeme_id: element.systems.systeme_id },
            attributes: [],
            include: [
                { model: db.client, required: false, as: 'clients', through: { attributes: [] }, attributes: ['companyname'] }
            ],
        }).map(result => result.toJSON()).then(async allClients => {

            let clients = utils.first(allClients).clients;

            if (clients.some(client => client.companyname == 'ETHIAS' || client.companyname == 'NRB' || client.companyname == 'SIBELGA')) {
                element['COMPANY-NAME'] = 'PROD-NRB'

            } else {
                element['COMPANY-NAME'] = clients[0];
            }
        })
        resolve(element);
    });
}


async function setCompanyOccurence(element) {
    try {
        return await new Promise(async function(resolve) {
            await db.occurence_client.findAll({ where: { occurencesoft_id: element.id }, attributes: ['client_id'] }).map(result => result.toJSON()).then(async allClients => {
                if (allClients.length > 1) {
                    element['COMPANY'] = 'PROD-NRB'
                } else {
                    if (allClients != undefined && allClients.length > 0) {
                        let step1 = await db.client.findOne({ where: { client_id: allClients[0].client_id }, attributes: ['companyname'] })

                        element['COMPANY'] = step1.dataValues.companyname;
                    }

                }
            })

            resolve(element);
        });
    } catch (error) {
        console.log(error)
    }

}