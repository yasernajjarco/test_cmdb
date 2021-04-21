const db = require("./index.db");
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const { Sequelize, DataTypes, Op } = require("sequelize");
const prfixeTest = 'test ';
const utils = require("./controllers/utils");
const subtypes = [{
        'B': [
            ['Mainframe Bull'],
            ['Mainframe Appliance Console', 'Switch'],
            ['Mainframe Drive Enclosure'],
            ['Mainframe VTS', 'Mainframe Tape Library']
        ]
    },
    {
        'Z': [
            [' Mainframe IBM'],
            ['Mainframe Appliance Console'],
            ['Mainframe Drive Enclosure'],
            ['Mainframe VTS']
        ]
    }

]

export async function start() {


    // await generateInstances();
    // await generateOccurences();
    await generteHardwares();

};


async function generateInstances() {
    await db.platforms.findAll().map(data => data.toJSON()).then(platforms => {
        platforms.forEach(one => {
            let platform = one.name;
            //  let platform = 'B';
            let ASSIGNMENT = (platform == 'Z') ? 'ZSYS' : 'GCOS';


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
                                },
                                {
                                    model: db.client,
                                    required: false,
                                    as: 'clients',
                                    through: { attributes: [] },
                                    attributes: [
                                        [Sequelize.col('companyname'), 'name'],
                                        [Sequelize.col('client_id'), 'id']

                                    ]
                                },
                            ],
                        },
                    ],
                    attributes: [
                        ['instance_id', 'id'],
                        [Sequelize.col('ci.our_name'), '__EMPTY'],
                        [Sequelize.col('application.ci.logical_name'), 'APPLICATION'],
                        [Sequelize.col('systems.ci.our_name'), 'NETWORK_NAME'],
                        [Sequelize.col('ci.ciType.name'), 'TYPE'],
                        [Sequelize.col('ci.ciSubtype.name'), 'SUBTYPE'],
                        [Sequelize.col('ci.logical_name'), 'LOGICAL_NAME'],
                        [Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.prefixe"), '_', Sequelize.col("ci.our_name")), 'DISPLAY_NAME'],

                        [Sequelize.fn('CONCAT', '', ''), 'COMPANY'],

                        [Sequelize.col('ci.nrb_managed_by'), 'NRB_MANAGED_BY'],

                        [Sequelize.fn('CONCAT', ASSIGNMENT), 'ASSIGNMENT'],
                        [Sequelize.col('ci.status.name'), 'ISTATUS'],
                        [Sequelize.col('ci.description'), 'DESCRIPTION'],

                    ]
                }).map(data => data.toJSON())
                .then(async data => {

                    let result = [];
                    data.forEach(element => {
                        result.push(setCompanyInstance(element))
                    })
                    addLine(result, 'instance')

                    let pathFile = path.resolve(__dirname, 'Exported files/', prfixeTest + 'CI sinstance ' + platform + '.xlsx')
                    generateFiles('sinstance|Mainframe Software', pathFile, result)



                }).catch(err => {
                    console.log(err)
                });
        })
    })

}

async function generateOccurences() {
    await db.platforms.findAll().map(data => data.toJSON()).then(platforms => {
        platforms.forEach(one => {
            //let platform = one.name;
            let platform = 'B';

            let ASSIGNMENT = (platform == 'Z') ? 'ZSYS' : 'GCOS';

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
                            model: db.client,
                            required: false,
                            as: 'clients',
                            through: { attributes: [] },
                            attributes: [
                                [Sequelize.col('companyname'), 'name'],
                                [Sequelize.col('client_id'), 'id']

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
                        [Sequelize.fn('CONCAT', '', ''), 'COMPANY'],

                        [Sequelize.col('ci.nrb_managed_by'), 'NRB_MANAGED_BY'],

                        [Sequelize.fn('CONCAT', ASSIGNMENT), 'ASSIGNMENT'],
                        [Sequelize.col('ci.status.name'), 'ISTATUS'],
                        [Sequelize.col('ci.description'), 'DESCRIPTION'],

                    ]
                }).map(data => data.toJSON())
                .then(async data => {

                    let result = [];
                    data.forEach(element => result.push(setCompanyOccurence(element)))
                    console.log(result)
                        /*   Promise.all(result)
                        .then(result => {
                            let pathFile = path.resolve(__dirname, 'Exported files/', prfixeTest + 'CI software ' + platform + '.xlsx')
                            generateFiles('occurence|Mainframe Subsystem', pathFile, result)
                        })

 */
                }).catch(err => {
                    console.log(err)
                });
        })
    })
}

async function generteHardwares() {
    let allResult = []


    await db.platforms.findAll().map(async data => data.toJSON()).then(async platforms => {
        await platforms.forEach(async one => {
            //let platform = one.name;
            let platform = 'B';

            allResult = await getHardwareforPlatform(platform);


        })
    })
    Promise.all(allResult)
        .then(result => {
            console.log(result)
        })

}

async function getHardwareforPlatform(platform) {
    return await new Promise(async function(resolve) {
        let allResult = [];
        let ASSIGNMENT = (platform == 'Z') ? 'ZSYS' : 'GCOS';
        let condition = (platform !== undefined) ? { '$ci.platforms.name$': platform } : {};

        let subTypes;
        let i = 0;
        while (subtypes[i][platform] == undefined) {
            i++;
        }
        subTypes = subtypes[i][platform];
        await subTypes.forEach(async(subTypeName) => {
            let cond = [];
            await subTypeName.forEach(element => {

                cond.push({
                    '$ci.ciSubtype.name$': {
                        [Op.like]: `%${element}%`
                    }
                });


            });
            condition[Op.or] = cond;
            allResult.push(getHardwaresBySubtype(condition, ASSIGNMENT).then(async result => {
                return new Promise(() => result)
            }));
        });

        resolve(allResult)

    });
}

async function getHardwaresBySubtype(condition, ASSIGNMENT) {
    return await new Promise(async function(resolve) {

        await db.hardwares.findAll({
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
                        model: db.client,
                        required: false,
                        as: 'clients',
                        through: { attributes: [] },
                        attributes: [
                            [Sequelize.col('companyname'), 'name'],
                            [Sequelize.col('client_id'), 'id']
                        ]
                    },

                ],
                attributes: [
                    ['hardware_id', 'id'],
                    [Sequelize.col('ci.our_name'), '__EMPTY'],
                    [Sequelize.col('ci.ciType.name'), 'TYPE'],
                    [Sequelize.col('ci.ciSubtype.name'), 'SUBTYPE'],
                    [Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.prefixe"), '_', Sequelize.col("ci.our_name")), 'DISPLAY_NAME'],
                    [Sequelize.fn('CONCAT', '', ''), 'COMPANY'],

                    [Sequelize.col('ci.nrb_managed_by'), 'NRB_MANAGED_BY'],

                    [Sequelize.fn('CONCAT', ASSIGNMENT), 'ASSIGNMENT'],
                    [Sequelize.col('ci.classService.name'), 'NRB_CLASS_SERVICE'],
                    [Sequelize.col('ci.envType.name'), 'NRB_ENV_TYPE'],

                    [Sequelize.col('ci.status.name'), 'ISTATUS'],
                    [Sequelize.col('ci.description'), 'DESCRIPTION'],
                    ['serial_no', 'SERIAL_NO']
                ]
            }).map(async(data) => data.toJSON())
            .then(async(data) => {

                let result = [];
                await data.forEach(element => {
                    result.push(setCompanyHardware(element));
                });
                await addLine(result, 'hardware');

                resolve(result)

            }).catch(err => {
                console.log(err);
            });
    })
}

function generateFiles(nameSheet, pathFile, data) {


    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    XLSX.writeFile(wb, pathFile);

}

function setCompanyInstance(element) {
    let clients = element.systems.clients;
    if (clients.some(element => element.isshared == 1)) {
        element['COMPANY'] = 'PROD-NRB'
    } else {
        element['COMPANY'] = clients[0].name

    }
    delete element.systems;
    delete element.id;
    return element;
}

function setCompanyHardware(element) {
    let clients = element.clients;
    if (clients != undefined && clients.length > 1) {
        element['COMPANY'] = 'PROD-NRB'
    } else {
        element['COMPANY'] = clients[0].name

    }
    delete element.clients;
    delete element.id;
    return element;
}

function addLine(arr, type) {
    let firstLine = getLineDescription(type)

    let lineDesc = {...arr[0] };
    let i = 0;
    for (let value of Object.keys(lineDesc)) {
        try {
            if (firstLine[i] != undefined) lineDesc[value] = firstLine[i];
            else lineDesc[value] = value;

        } catch (error) {
            lineDesc[value] = value;
        }
        i++;
    }
    arr.splice(0, 0, lineDesc);
}

function getLineDescription(type) {
    switch (type) {
        case 'instance':
            return ['Our name', 'application', 'Mainframe System', 'sinstance', 'Mainframe Software', '="B C"', '=MBULL_(Our name)', 'Client ou PROD-NRB', 'NRB', 'GCOS', 'Operational', 'Description'];
        case 'hardware':
            return [];

    }
}


function setCompanyOccurence(element) {

    let clients = element.clients;
    if (clients.some(element => element.isshared == 1)) {
        element['COMPANY'] = 'PROD-NRB'
    } else {
        element['COMPANY'] = clients[0].name

    }
    delete element.clients;
    delete element.id;
    return element;
}