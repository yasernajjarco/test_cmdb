const db = require("./index.db");
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const { Sequelize, DataTypes, Op } = require("sequelize");


export async function start() {
    let platform = 'B';
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
                    attributes: [],
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
        .then(data => {
            //let pathFile = path.resolve(__dirname, 'Exported files/', 'CI sinstance ' + platform + '.xlsx')
            // generateFiles('sinstance|Mainframe Software', pathFile, data)


            setCompany(data).then(result => {
                console.log(result)

            })




        }).catch(err => {
            console.log(err)
        });


};


function generateFiles(nameSheet, pathFile, data) {


    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    XLSX.writeFile(wb, pathFile);

}

async function setCompany(data) {
    return await new Promise(async function(resolve) {
        let result = [...data]
        await data.forEach(async element => {
            db.instance_client.findAll({ where: { instance_id: element.id }, attributes: ['client_id'] }).map(result => result.toJSON()).then(async allClients => {
                if (allClients.length > 1) {
                    result['COMPANY'] = 'PROD-NRB'
                } else {

                    let step1 = await db.client.findOne({ where: { client_id: allClients[0].client_id }, attributes: ['companyname'] })

                    result['COMPANY'] = step1.dataValues.companyname;
                }
            })

        })
        resolve(result);
    });
}