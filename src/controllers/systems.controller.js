const db = require("../index.db");
const utils = require("./utils");
const { Sequelize, DataTypes, Op } = require("sequelize");
const messageErrors = require("../config/messageErrors.json");

/**
 * Retrieves all elements systems  
 * @param {Request} req the request coming from client (HTTP), it could contain the (type, subtype, platform, and columns: [])
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of system elements [] .
 * @returns {[]}   the list of system elements
 */
exports.findAll = (req, res) => {
    const platform = req.body.platform;
    const type = req.body.type;
    const subtype = req.body.subtype;

    let condition = buildCondition(platform, type, subtype);
    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);
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
                    model: db.lpars,
                    required: false,
                    as: 'lpars',
                    attributes: [],
                    include: [
                        { model: db.ci, required: false, as: 'ci', attributes: [] }
                    ],
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
 * Retrieves one element system by id  
 * @param {Request} req the request coming from client (HTTP).
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system element found or an empty object if it did not find an object corresponding to the sent id
 * @returns {system}  the object system found or {}
 */
exports.findById = (req, res) => {

    const id = req.params.id;
    getById(id, res);

};

/**
 * update one element hardware
 * @param {Request} req the request coming from client (HTTP).
 * it could contain all the modifiable attributes of a hardware object like ( name, environment, status, description, classService, last_update)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system update object if there is no error detected, otherwise an error message
 * @returns {system}  the object system updated found or error message
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
                    let audit = utils.buildAudit('update element system', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)

            })
            .catch(err => {
                res.status(500).send(messageErrors[402]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }


};




/**
 * add partition to element system 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the partition to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system update object if there is no error detected, otherwise an error message
 * @returns {system}  the object system updated found or error message
 */
exports.addPartition = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update); // check if  last_update is the most recent otherwise it will produce an exception

        let systeme_id = await getIdSyseme(id)
        let lpar_id = await getIdLpar(req.body.id)

        db.systems.update({ lpar_id: lpar_id }, { where: { systeme_id: systeme_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) { //if num > 0, it detected at least one change for this element
                    let audit = utils.buildAudit('update relation partition-system', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErrors[403]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }

};

/**
 * remove partition from element system 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the partition to which the relation should be removed like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system update object if there is no error detected, otherwise an error message
 * @returns {system}  the object system updated found or error message
 */
exports.deletePartition = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update); // check if  last_update is the most recent otherwise it will produce an exception
        let systeme_id = await getIdSyseme(id)
        db.systems.update({ lpar_id: null }, { where: { systeme_id: systeme_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) { //if num > 0, it detected at least one change for this element
                    let audit = utils.buildAudit('remove relation partition-hardware', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErrors[404]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }


};

/**
 * add client to element system 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the client to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system update object if there is no error detected, otherwise an error message
 * @returns {system}  the object system updated found or error message
 */
exports.addClient = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update); // check if  last_update is the most recent otherwise it will produce an exception

        let systeme_id = await getIdSyseme(id)
        let client_id = req.body.id

        db.client_systeme.findOrCreate({
                where: {
                    [db.Op.and]: [{ client_id: client_id, systeme_id: systeme_id }]
                },
                defaults: {
                    client_id: client_id,
                    systeme_id: systeme_id

                }
            }).then(num => {
                if (num[0]._options.isNewRecord) {
                    db.audit.create({
                        audittimestamp: Sequelize.fn('NOW'),
                        audituser: req.user,
                        auditdescription: 'add relation hardware-client',
                        ci_id: id
                    })
                }
                getById(id, res)

            })
            .catch(err => {
                res.status(500).send(messageErrors[405]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }



};

/**
 * remove client from element system 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the client to which the relation should be removed like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system update object if there is no error detected, otherwise an error message
 * @returns {system}  the object system updated found or error message
 */
exports.deleteClient = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update); // check if  last_update is the most recent otherwise it will produce an exception

        let systeme_id = await getIdSyseme(id)
        let client_id = req.body.id

        db.client_systeme.destroy({
                where: {
                    [db.Op.and]: [{ client_id: client_id, systeme_id: systeme_id }]
                }
            }).then(async num => {
                if (num > 0) { //if num > 0, it detected at least one change for this element
                    let audit = utils.buildAudit('remove relation hardware-client', id, req.user)
                    await db.audit.create(audit)

                }
                getById(id, res)
            })
            .catch(err => {
                res.status(500).send(messageErrors[406]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }



};

/**
 * add zVM_Linux to element  system
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the zVM_Linux to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object system updated found or error message
 */
exports.addLinux = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let zlinux_id = await getIdZlinux(req.body.id)
        let systeme_id = await getIdSyseme(id)

        db.zLinux.update({ systeme_id: systeme_id }, { where: { zlinux_id: zlinux_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update relation system-zlinux', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErrors[407]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }


};


/**
 * remove zVM_Linux to element  system
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the zVM_Linux to which the relation should be removed like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the system update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object system updated found or error message
 */
exports.deleteLinux = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let zlinux_id = await getIdZlinux(req.body.id)

        db.zLinux.update({ systeme_id: null }, { where: { zlinux_id: zlinux_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('remove relation system-zlinux', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErrors[408]);

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

            case 'LPAR Host Type':
                attributes.push([Sequelize.col('lpars.host_type'), 'LPAR Host Type']);
                break;
            case 'LPAR Our Name':
                attributes.push([Sequelize.col('lpars.ci.our_name'), 'LPAR Our Name']);
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

    db.systems.findAll({
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
                    model: db.lpars,
                    required: false,
                    as: 'lpars',
                    include: [{
                        model: db.ci,
                        required: false,
                        include: [
                            { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [], },
                            { model: db.ciType, required: false, as: 'ciType', attributes: [] },
                            { model: db.status, required: false, as: 'status', attributes: [] },

                        ],
                        as: 'ci',
                    }],
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

                {
                    model: db.zLinux,
                    required: false,
                    as: 'zLinuxs',
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
                    }],
                    attributes: [
                        ['ci_id', 'id']
                    ]
                },

            ],
            attributes: [
                ['ci_id', 'id'],
                [Sequelize.col('ci.our_name'), 'name'],
                [Sequelize.col('ci.ciType.name'), 'type'],
                [Sequelize.col('ci.logical_name'), 'logical_name'],
                [Sequelize.col('ci.ciSubtype.name'), 'subtype'],
                [Sequelize.col('ci.envType.name'), 'environnement'],
                [Sequelize.col('ci.status.name'), 'status'],
                [Sequelize.col('ci.description'), 'description'],
                [Sequelize.col('ci.classService.name'), 'classService'],
                [Sequelize.col('ci.nrb_managed_by'), 'nrb_managed_by'],
                [Sequelize.col('ci.platforms.name'), 'platform'],

                [Sequelize.col('lpars.ci.our_name'), '_partition name'],
                [Sequelize.col('lpars.ci.ciSubtype.name'), '_partition subtype'],
                [Sequelize.col('lpars.ci.ciType.name'), '_partition type'],
                [Sequelize.col('lpars.ci.ci_id'), '_partition id'],
                [Sequelize.col('lpars.ci.status.name'), '_partition status'],


                // [Sequelize.col('clients.companyname'), '_Client name'],
                // [Sequelize.col('clients.client_id'), '_Client id'],


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
        }).catch(err => {
            res.status(500).send(messageErrors[401]);
        });
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
        throw new Error('112');
    }

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
 * @returns zlinux_id of element zVM_linux where his ci_id if can be found, else return Exception 
 */
async function getIdZlinux(id) {
    try {
        let step1 = await db.zLinux.findOne({ where: { ci_id: id }, attributes: ['zlinux_id'] })
        return step1.dataValues.zlinux_id;
    } catch (error) {
        throw new Error('312');
    }

}