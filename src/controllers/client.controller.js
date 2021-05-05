const db = require("../index.db");
const utils = require("./utils");
const messageErrors = require("../config/messageErrors.json");


/**
 * Retrieves all clients  
 * @param {Request} req the request coming from client (HTTP), it could contain the ( platform, and columns: [])
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of clients [] .
 * @returns {[]}   the list of clients
 */
exports.findAll = (req, res) => {

    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);
    let condition = buildCondition(req.body.platform);

    db.client.findAll({
            where: condition,
            attributes: attributes,
            include: [{
                model: db.platforms,
                required: false,
                as: 'platforms',
                through: { attributes: [] },
                attributes: []
            }, ],
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });



};

/**
 * Retrieves one client by id  
 * @param {Request} req the request coming from client (HTTP).
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the  client found or an empty object if it did not find an object corresponding to the sent id
 * @returns {client}  the object client found or {}
 */
exports.findById = (req, res) => {
    const id = req.params.id;
    getById(id, res);
};

/**
 * update one client
 * @param {Request} req the request coming from client (HTTP).
 * it could contain all the modifiable attributes of a software object like (vendor_code,name, vendor)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the client update object if there is no error detected, otherwise an error message
 * @returns {client}  the object client updated found or error message
 */
exports.update = async(req, res) => {
    const id = req.params.id;
    try {
        db.client.update({ companyname: req.body.name }, {
                where: { client_id: id }
            }).then(result => {
                getById(id, res)
            })
            .catch(err => {
                res.status(500).send(messageErrors[702]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }
};

/**
 * 
 * @param {[]} columns the list of columns that should be placed in the requested object
 * @returns an array with the key and the value (the field name) of each column for Sequelize
 */
function buildAttributes(columns) {
    let attributes = [];
    columns.forEach(element => {
        switch (element) {

            case 'name':
                attributes.push(['companyname', 'name']);
                break;
            case 'address':
                attributes.push(['address', 'address']);
                break;
            case 'id':
                attributes.push(['client_id', 'id']);
                break;
        }


    });

    return attributes;

}

/**
 * 
 * @param {Sting} platform  the name of the platform (Z, B, I)
 * @returns an object which allows to make the where clause for the mysql request with Sequelize
 */
function buildCondition(platform) {
    let condition = (platform !== undefined) ? { '$platforms.name$': platform } : {};
    return condition;
}

/**
 * 
 * @param {Integer} id  id of client
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @returns object for the element found on the basis of its id, the result is based on the response to the Sequelize request (see documentation https://sequelize.org/master/manual/model-querying-basics.html )
 */
function getById(id, res) {
    db.client.findOne({
            where: { client_id: id },
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
                    }],
                    attributes: [
                        ['ci_id', 'id']
                    ]
                },

                {
                    model: db.zLinux,
                    required: false,
                    as: 'zLinux',
                    through: { attributes: [] },
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
                    }],
                    attributes: [
                        ['ci_id', 'id']
                    ]
                },
                /*  {
                     model: db.instance,
                     required: false,
                     as: 'instances',
                     through: { attributes: [] },
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
                     }],
                     attributes: [
                         ['ci_id', 'id']
                     ]
                 }, */
                {
                    model: db.occurence,
                    required: false,
                    as: 'occurences',
                    through: { attributes: [] },
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
                    }],
                    attributes: [
                        ['ci_id', 'id']
                    ]
                },
                {
                    model: db.contact,
                    required: false,
                    as: 'contacts',
                    attributes: [
                        ['contact_id', 'id'],
                        ['lastname', 'lastname'],
                        ['firstname', 'firstname']
                    ]
                },

            ],

            attributes: [
                ['client_id', 'id'],
                ['companyname', 'name'],
            ]

        }) //.map(data => data.toJSON())
        .then(function(data) {
            if (data == undefined || data.length == 0) res.send({});
            else {
                let result = utils.buildObject(data.toJSON());
                res.send(result);
            }
        }).catch(err => {
            res.status(500).send(messageErrors[701]);

        });
}

/* function buildResult(data) {
    let apps = [];
    data.forEach(element => {
        element.instances.forEach(instance => {
            apps.push(getApp(instance, element.id))
        })

        element.instances = apps;
        delete element.clients;

    })
    return data;
} */

/* function getApp(instance, id) {
    return { instance_id: instance.id, systeme_id: id, application_id: instance.application.ci_application_id, status: instance.ci.status.name, code: getName(instance.application.ci.logical_name), version: getVersion(instance.application.ci.logical_name), Vendor: instance.application.provider.name, Date_EOS: instance.application.end_of_support_date }
}

function getName(appName) {
    return appName.substring(0, appName.lastIndexOf(' ')).trim();
}

function getVersion(appName) {
    return appName.substring(appName.lastIndexOf(' ') + 1).trim();
} */

/* 
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
                                    attributes: ['logical_name', 'our_name'],

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

                // [Sequelize.col('clients.companyname'), '_Client name'],
                // [Sequelize.col('clients.client_id'), '_Client id'],


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


}; */