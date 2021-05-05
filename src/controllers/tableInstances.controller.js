const db = require("../index.db");
const Provider = db.provider;
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require("sequelize");
const utils = require("./utils");

/**
 * Retrieves all systems and all instances of every system, if id of client is -1, it's meaning thant for client shared, so return all systems of all clients shared
 * @param {Request} req the request coming from client (HTTP)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of systems []
 * @returns {[]}   the list of systems with instances included
 */

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
            if (data == undefined || data.length == 0) res.send({});
            else {
                let result = buildResult(data)
                res.send(result);
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });

};

/**
 * Retrieves all clients no shared and class service of his system is 'PAAS', and for clients shared return it like PROD-NRB
 * @param {Request} req the request coming from client (HTTP)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of clients [] no shared or PROD-NRB.
 * @returns {[]}   the list of clients
 */
exports.findClientsForTable = (req, res) => {

    db.client.findAll({
            where: {
                '$systems.ci.classService.name$': 'PAAS'
            },
            include: [{
                model: db.systems,
                required: false,
                through: { attributes: [] },
                as: 'systems',
                include: [{
                    model: db.ci,
                    required: false,
                    as: 'ci',
                    include: [
                        { model: db.classService, required: false, as: 'classService', attributes: [], }
                    ],
                    attributes: []
                }],
                attributes: ['ci_id']
            }],

            attributes: [
                ['client_id', 'id'],
                ['companyname', 'name'],
                'isshared'
            ]
        }).map(data => data.toJSON())
        .then(data => {
            if (data == undefined || data.length == 0) res.send({});
            else {
                if (data.some(element => element.isshared == 1)) {
                    data = data.filter(function(item) { return item.isshared !== 1 });
                    data.push({ id: -1, name: 'PROD-NRB' })
                }
                data.forEach(element => {
                    delete element.isshared;
                    delete element.systems;
                })
                res.send(data);
            }
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