const db = require("../index.db");
const Provider = db.provider;
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require("sequelize");
const utils = require("./utils");





exports.buildTableById = (req, res) => {

    const id = req.params.id;

    let condition = (id > 0) ? { '$clients.client_id$': id } : { '$clients.isshared$': 1 }



    db.systems.findAll({
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
                    as: 'instances',
                    include: [{
                            model: db.ci,
                            required: false,
                            as: 'ci',
                            include: [
                                { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: ['name'] },
                                { model: db.ciType, required: false, as: 'ciType', attributes: ['name'] },
                                { model: db.status, required: false, as: 'status', attributes: ['name'], },

                            ],
                            attributes: ['our_name', ['ci_id', 'id']]
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
                                        { model: db.status, required: false, as: 'status', attributes: [] },

                                    ],
                                    as: 'ci',
                                    attributes: ['logical_name', 'our_name', 'description'],

                                },
                                { model: db.provider, required: false, as: 'provider', attributes: ['name'] },
                            ],
                            //attributes: []
                        },
                    ],
                    attributes: [
                        ['ci_id', 'id']
                    ]
                },

            ],
            attributes: [
                ['ci_id', 'id'],
                [Sequelize.col('ci.logical_name'), 'logical_name'],
                [Sequelize.col('ci.status.name'), 'status']
            ]

        }).map(data => data.toJSON())
        .then(data => {
            let result = buildResult(data)
            console.log(result.length)
            res.send(result);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });

};

exports.findClientsForTable = (req, res) => {

    db.client.findAll({

            attributes: [
                ['client_id', 'id'],
                ['companyname', 'name'],
                'isshared'
            ]
        }).map(data => data.toJSON())
        .then(data => {
            console.log(data)
            if (data.some(element => element.isshared == 1)) {
                data = data.filter(function(item) { return item.isshared !== 1 });
                data.push({ id: -1, name: 'PROD-NRB' })
            }

            data.forEach(element => {

                delete element.isshared

            })
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });


};


function buildResult(data) {
    data.forEach(element => {
        let apps = [];
        element.instances.forEach(instance => {
            apps.push(getApp(instance, element.id))
        })

        element.instances = apps;
        delete element.clients;

    })
    return data;
}

function getApp(instance, id) {
    return { instance_id: instance.id, systeme_id: id, application_id: instance.application.ci_application_id, product: instance.application.ci.description, status: instance.ci.status.name, code: getName(instance.application.ci.logical_name), version: getVersion(instance.application.ci.logical_name), Vendor: instance.application.provider.name, Date_EOS: instance.application.end_of_support_date }
}

function getName(appName) {
    return appName.substring(0, appName.lastIndexOf(' ')).trim();
}

function getVersion(appName) {
    return appName.substring(appName.lastIndexOf(' ') + 1).trim();
}