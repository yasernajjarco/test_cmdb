const db = require("../index.db");
const Provider = db.provider;
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require("sequelize");
const utils = require("./utils");





exports.buildTableById = (req, res) => {

    const id = req.params.id;

    let condition = (id > 0) ? { '$clients.client_id$': id } : {

        [db.Op.or]: [{ '$clients.companyname$': ['SIBELGA', 'NRB'] }]
    }

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
            data.forEach(element => console.log(element.instances.length))
            let result = buildResult(data)
            res.send(result);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });

};

exports.findClientsForTable = (req, res) => {

    db.client.findAll({
            include: [{
                    model: db.systems,
                    required: false,
                    as: 'systems',
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
                            model: db.client,
                            required: false,
                            as: 'clients',
                            through: { attributes: [] },

                        }
                    ],
                    attributes: [
                        ['ci_id', 'id']
                    ]
                },

            ],
            attributes: [
                ['client_id', 'id'],
                ['companyname', 'name'],
            ]
        }).map(data => data.toJSON())
        .then(data => {
            let result = [];
            data.forEach(element => {
                let clients = (element.systems[0] != undefined) ? element.systems[0].clients : [];
                if (clients.some(client => client.companyname == 'ETHIAS' || client.companyname == 'NRB' || client.companyname == 'SIBELGA')) {
                    console.log(clients)
                    if (!result.some(item => item.name == 'PROD-NRB')) result.push({ name: 'PROD-NRB', id: -1 })
                } else if (!result.some(item => item.name === element.name)) {
                    result.push({ name: element.name, id: element.id })
                }

            })
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });


};



/* function buildResult(systems, apps, data) {
    let result = [];
    systems.forEach(sys => {
        result.push({ name: sys.logical_name, apps: [] })
    })

    apps.forEach(app => {
        let index = result.findIndex(function(item) { return item.name === app.sysName })

        result[index].apps.push(app)

    })
    return result;
} */

function buildSystems(data) {
    let systems = [];
    data.forEach(element => {
        let isFound = systems.some(function(el) { return el.logical_name === element.logical_name });
        if (!isFound) systems.push({ logical_name: element.logical_name })
    })
    return systems;
}


function buildResult(data) {
    let apps = [];
    data.forEach(element => {
        /* let isFound = apps.some(function(el) { return el.ci_application_id == element.application.ci_application_id && el.sysName == element.systems.ci.logical_name });
        if (!isFound)  */
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