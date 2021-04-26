const db = require("../index.db");
const utils = require("./utils");
const messageErreurs = require("../config/messageErrors.json");
const { Sequelize, Op } = require("sequelize");


/**
 * Retrieves all elements partition  
 * @param {Request} req the request coming from client (HTTP), it could contain the (type, subtype, platform, and columns: [])
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of partition elements [] .
 * @returns {[]}   the list of partition elements
 */
exports.findAll = (req, res) => {
    //    const platform = req.query.id;
    //[Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.name"), '_', Sequelize.col("ci.our_name")), 'Displayname']

    const platform = req.body.platform;
    const type = req.body.type;
    const subtype = req.body.subtype;

    let condition = buildCondition(platform, type, subtype);
    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);

    db.lpars.findAll({
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
                    model: db.hardwares,
                    required: false,
                    as: 'hardwares',
                    attributes: [],
                    include: [
                        { model: db.ci, required: false, as: 'ci', attributes: [] }

                    ]
                },
            ],
            attributes: attributes
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
 * Retrieves one element partition by id  
 * @param {Request} req the request coming from client (HTTP).
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the partition element found or an empty object if it did not find an object corresponding to the sent id
 * @returns {partition}  the object partition found or {}
 */
exports.findById = (req, res) => {
    const id = req.params.id;
    getById(id, res);
};


/**
 * update one element hardware
 * @param {Request} req the request coming from client (HTTP).
 * it could contain all the modifiable attributes of a partition object like ( name, environment, status, description, classService, last_update)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the partition update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object partition updated found or error message
 */
exports.update = async(req, res) => {
    const id = req.params.id;
    try {

        await utils.isLastUpdate(id, req.body.last_update);
        const class_service_id = await utils.get_classService_id(req.body.classService)
        const status_id = await utils.get_status_id(req.body.status)
        const environnement_id = await utils.get_environnement_id(req.body.environnement)


        db.ci.update({ logical_name: req.body.logical_name, description: req.body.description, our_name: req.body.name, class_service_id: class_service_id, status_id: status_id, env_type_id: environnement_id }, {
                where: { ci_id: id }
            }).then(result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update element partition', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)

            })
            .catch(err => {
                res.status(500).send(messageErreurs[202]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }


};


/**
 * add system to element partition 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the system to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the partition update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object partition updated found or error message
 */
exports.addSystem = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let lpar_id = await getIdLpar(id)
        let system_id = await getIdSyseme(req.body.id)

        db.systems.update({ lpar_id: lpar_id }, { where: { systeme_id: system_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update relation partition-system', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErreurs[203]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }


};

/**
 * remove system from element partition 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the system to which the relation should be removed like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the partition update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object partition updated found or error message
 */
exports.deleteSystem = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let system_id = await getIdSyseme(req.body.id)

        db.systems.update({ lpar_id: null }, { where: { systeme_id: system_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('delete relation partition-system', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErreurs[204]);

            });
    } catch (error) {
        console.log(error)
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }


};

/**
 * add hardware to element partition 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the hardware to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the partition update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object partition updated found or error message
 */
exports.addHardware = async(req, res) => {
    const id = req.params.id;

    try {
        // await utils.isLastUpdate(id, req.body.last_update);
        let lpar_id = await getIdLpar(id)
        let hardware_id = await getIdHardware(req.body.id)

        db.lpars.update({ hardware_id: hardware_id }, { where: { lpar_id: lpar_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update relation partition-hardware', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErreurs[205]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }


};


/**
 * remove hardware from element partition 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the hardware to which the relation should be removed like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the partition update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object partition updated found or error message
 */
exports.deleteHardware = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let lpar_id = await getIdLpar(id)

        db.lpars.update({ hardware_id: null }, { where: { lpar_id: lpar_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update relation partition-hardware', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErreurs[206]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
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
                attributes.push([Sequelize.col('ci.our_name'), 'name']);
                break;
            case 'type':
                attributes.push([Sequelize.col('ci.ciType.name'), 'type']);
                break;
            case 'subtype':
                attributes.push([Sequelize.col('ci.ciSubtype.name'), 'subtype']);
                break;
            case 'environnement':
                attributes.push([Sequelize.col('ci.envType.name'), 'environnement']);
                break;
            case 'status':
                attributes.push([Sequelize.col('ci.status.name'), 'status']);
                break;
            case 'description':
                attributes.push([Sequelize.col('ci.description'), 'description']);
                break;
            case 'classService':
                attributes.push([Sequelize.col('ci.classService.name'), 'classService']);
                break;
            case 'nrb_managed_by':
                attributes.push([Sequelize.col('ci.nrb_managed_by'), 'nrb_managed_by']);
                break;
            case 'logical_name':
                attributes.push([Sequelize.col('ci.logical_name'), 'logical_name']);
                break;
            case 'platform':
                attributes.push([Sequelize.col('ci.platforms.name'), 'platform']);
                break;
            case 'id':
                attributes.push(['ci_id', 'id']);
                break;
            case 'host_type':
                attributes.push(['host_type', 'host_type']);
                break;
            case 'hardware':
                attributes.push([Sequelize.col('hardwares.ci_id'), 'hardware id']);
                break;

        }


    });

    return attributes;

}

/**
 * 
 * @param {Sting} platform  the name of the platform (Z, B, I)
 * @param {Sting} type the name of type (pserver, ...)
 * @param {Sting} subtype the name of subtype (Mainframe IBM, ...)
 * @returns an object which allows to make the where clause for the mysql request with Sequelize
 */
function buildCondition(platform, type, subtype) {
    console.log(platform)
    let condition = (platform !== undefined) ? { '$ci.platforms.name$': platform } : {};

    (type !== undefined) ? condition['$ci.ciType.name$'] = {
        [Op.like]: `%${type}%`
    }: {};
    (subtype !== undefined) ? condition['$ci.ciSubtype.name$'] = {
        [Op.like]: `%${subtype}%`
    }: {};
    return condition;
}


/**
 * 
 * @param {Integer} id  id of element ci
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @returns object for the element found on the basis of its id, the result is based on the response to the Sequelize request (see documentation https://sequelize.org/master/manual/model-querying-basics.html )
 */

function getById(id, res) {
    db.lpars.findAll({
            where: { ci_id: id },
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
                    model: db.hardwares,
                    required: false,
                    as: 'hardwares',
                    include: [{
                        model: db.ci,
                        required: false,
                        as: 'ci',
                        include: [
                            { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [] },
                            { model: db.ciType, required: false, as: 'ciType', attributes: [] },
                            { model: db.status, required: false, as: 'status', attributes: [] },

                        ]
                    }],
                    attributes: []
                },
                {
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
                }
            ],
            attributes: [
                ['ci_id', 'id'],
                [Sequelize.col('ci.our_name'), 'name'],
                [Sequelize.col('ci.logical_name'), 'logical_name'],
                [Sequelize.col('ci.ciType.name'), 'type'],
                [Sequelize.col('ci.ciSubtype.name'), 'subtype'],
                [Sequelize.col('ci.envType.name'), 'environnement'],
                [Sequelize.col('ci.status.name'), 'status'],
                [Sequelize.col('ci.description'), 'description'],
                [Sequelize.col('ci.classService.name'), 'classService'],
                [Sequelize.col('ci.nrb_managed_by'), 'nrb_managed_by'],
                [Sequelize.col('ci.platforms.name'), 'platform'],

                [Sequelize.col('hardwares.ci.our_name'), '_hardware name'],
                [Sequelize.col('hardwares.ci.ciSubtype.name'), '_hardware subtype'],
                [Sequelize.col('hardwares.ci.ciType.name'), '_hardware type'],
                [Sequelize.col('hardwares.ci.ci_id'), '_hardware id'],
                [Sequelize.col('hardwares.ci.status.name'), '_hardware status'],


            ]

        }).map(data => data.toJSON())
        .then(async data => {
            if (data == undefined || data.length == 0) res.send({});
            else {
                let result = utils.buildObject(utils.first(data));
                let audit = await utils.getLastAudit(result.id);
                if (audit != null) result['audit'] = audit;

                res.send(result);
            }
        })
        .catch(err => {
            res.status(500).send(messageErrors[201]);
        });
}


/**
 * 
 * @param {Integer} ci_id id of element ci
 * @returns system_id of element system where his ci_id if can be found, else return Exception 
 */
async function getIdSyseme(id) {
    try {
        let step1 = await db.systems.findOne({ where: { ci_id: id }, attributes: ['systeme_id'] })
        return step1.dataValues.systeme_id;
    } catch (error) {
        throw new Error('211');
    }

}


/**
 * 
 * @param {Integer} ci_id id of element ci
 * @returns lpar_id of element partition where his ci_id if can be found, else return Exception 
 */
async function getIdLpar(id) {
    try {
        let step1 = await db.lpars.findOne({ where: { ci_id: id }, attributes: ['lpar_id'] })
        return step1.dataValues.lpar_id;
    } catch (error) {
        throw new Error('212');
    }

}


/**
 * 
 * @param {Integer} ci_id id of element ci
 * @returns hardware_id of element hardware where his ci_id if can be found, else return Exception 
 */
async function getIdHardware(hardware_id) {
    try {
        let step1 = await db.hardwares.findOne({ where: { ci_id: hardware_id }, attributes: ['hardware_id'] })
        return step1.dataValues.hardware_id;
    } catch (error) {
        throw new Error('109');
    }

}