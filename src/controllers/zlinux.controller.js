const db = require("../index.db");
const utils = require("./utils");
const messageErrors = require("../config/messageErrors.json");
const { Sequelize, Op } = require("sequelize");

/**
 * Retrieves all elements zVM_Linux  
 * @param {Request} req the request coming from client (HTTP), it could contain the (type, subtype, platform, and columns: [])
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of zVM_Linux elements [] .
 * @returns {[]}   the list of zVM_Linux elements
 */
exports.findAll = (req, res) => {
    const platform = req.body.platform;
    const type = req.body.type;
    const subtype = req.body.subtype;

    let condition = buildCondition(platform, type, subtype);
    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);
    db.zLinux.findAll({
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
                    model: db.systems,
                    required: false,
                    as: 'systems',
                    attributes: [],
                    include: [
                        { model: db.ci, required: false, as: 'ci', attributes: [] }
                    ],
                }
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
 * Retrieves one element zVM_Linux by id  
 * @param {Request} req the request coming from client (HTTP).
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the zVM_Linux element found or an empty object if it did not find an object corresponding to the sent id
 * @returns {zVMLinux}  the object zVM_Linux found or {}
 */
exports.findById = (req, res) => {
    const id = req.params.id;
    getById(id, res);

};

/**
 * update one element zVM_Linux
 * @param {Request} req the request coming from client (HTTP).
 * it could contain all the modifiable attributes of a zVM_Linux object like ( domaine,os_version,cpu_type,cpu_number,physical_mem_total,name, environment, status, description, classService, last_update)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the zVM_Linux update object if there is no error detected, otherwise an error message
 * @returns {zVM_Linux}  the object zVM_Linux updated found or error message
 */
exports.update = async(req, res) => {
    const id = req.params.id;
    try {

        await utils.isLastUpdate(id, req.body.last_update);
        const class_service_id = await utils.get_classService_id(req.body.classService)
        const status_id = await utils.get_status_id(req.body.status)
        const environnement_id = await utils.get_environnement_id(req.body.environnement)


        db.zLinux.update({ domaine: req.body.domaine, os_version: req.body.os_version, cpu_type: req.body.cpu_type, cpu_number: req.body.cpu_number, physical_mem_total: req.body.physical_mem_total }, {
            where: { ci_id: id }
        }).then(async result => {
            let num = result[0];
            if (num > 0) {
                let audit = utils.buildAudit('update element zlinux', id, req.user)
                await db.audit.create(audit)
            }
            db.ci.update({ description: req.body.description, our_name: req.body.name, class_service_id: class_service_id, status_id: status_id, env_type_id: environnement_id }, {
                where: { ci_id: id }
            }).then(async result => {
                let num = result[0];
                if (num > 0) {

                    let audit = utils.buildAudit('update element zlinux', id, req.user)
                    await db.audit.create(audit)
                }

            })
        }).then(all => {
            getById(id, res)
        }).catch(err => {
            res.status(500).send(messageErrors[302]);
        });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }



};


/**
 * add system to element zVM_Linux 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the system to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the zVM_Linux update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object zVM_Linux updated found or error message
 */
exports.addSystem = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let zlinux_id = await getIdZlinux(id)
        let systeme_id = await getIdSyseme(req.body.id)


        db.zLinux.update({ systeme_id: systeme_id }, { where: { zlinux_id: zlinux_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update relation zlinux-system', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErrors[303]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }


};

/**
 * remove system from element zVM_Linux 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the system to which the relation should be removed like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the zVM_Linux update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object zVM_Linux updated found or error message
 */
exports.deleteSystem = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        //let systeme_id = await getIdSyseme(req.body.id)
        let zlinux_id = await getIdZlinux(id)

        db.zLinux.update({ systeme_id: null }, { where: { zlinux_id: zlinux_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('delete relation zlinux-system', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErrors[304]);

            });
    } catch (error) {
        console.log(error)
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }


};

/**
 * add client to element zVM_Linux 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the client to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the zVM_Linux update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object zVM_Linux updated found or error message
 */
exports.addClient = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update); // check if  last_update is the most recent otherwise it will produce an exception

        let zlinux_id = await getIdZlinux(id)
        let client_id = req.body.id

        db.client_zlinux.findOrCreate({
                where: {
                    [db.Op.and]: [{ client_id: client_id, zlinux_id: zlinux_id }]
                },
                defaults: {
                    client_id: client_id,
                    zlinux_id: zlinux_id

                }
            }).then(num => {
                if (num[0]._options.isNewRecord) {
                    db.audit.create({
                        audittimestamp: Sequelize.fn('NOW'),
                        audituser: req.user,
                        auditdescription: 'new client added for element',
                        ci_id: id
                    })
                }
                getById(id, res)

            })
            .catch(err => {
                res.status(500).send(messageErrors[305]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }



};


/**
 * remove client from element zVM_Linux 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the client to which the relation should be removed like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the zVM_Linux update object if there is no error detected, otherwise an error message
 * @returns {hardware}  the object zVM_Linux updated found or error message
 */
exports.deleteClient = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update); // check if  last_update is the most recent otherwise it will produce an exception

        let zlinux_id = await getIdZlinux(id)
        let client_id = req.body.id

        db.client_zlinux.destroy({
                where: {
                    [db.Op.and]: [{ client_id: client_id, zlinux_id: zlinux_id }]
                }
            }).then(async num => {
                if (num > 0) { //if num > 0, it detected at least one change for this element
                    let audit = utils.buildAudit('client removed from element', id, req.user)
                    await db.audit.create(audit)

                }
                getById(id, res)
            })
            .catch(err => {
                console.log(err)
                res.status(500).send(messageErrors[306]);
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

    db.zLinux.findAll({
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
                            { model: db.status, required: false, as: 'status', attributes: [] },

                        ],
                        attributes: []
                    }],
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
                ['ci_id', 'id'],
                [Sequelize.col('ci.our_name'), 'name'],
                [Sequelize.col('ci.ciType.name'), 'type'],
                [Sequelize.col('ci.ciSubtype.name'), 'subtype'],
                [Sequelize.col('ci.envType.name'), 'environnement'],
                [Sequelize.col('ci.status.name'), 'status'],
                [Sequelize.col('ci.description'), 'description'],
                [Sequelize.col('ci.classService.name'), 'classService'],
                [Sequelize.col('ci.nrb_managed_by'), 'nrb_managed_by'],
                [Sequelize.col('ci.platforms.name'), 'platform'],
                ['domaine', 'Domaine'],
                ['os_version', 'OS Version'],
                ['cpu_type', 'CPU Type'],
                ['cpu_number', 'CPU Number'],
                ['physical_mem_total', 'physical_mem_total'],
                [Sequelize.col('systems.ci.our_name'), '_system name'],
                [Sequelize.col('systems.ci.ciType.name'), '_system type'],
                [Sequelize.col('systems.ci.ciSubtype.name'), '_system subtype'],
                [Sequelize.col('systems.ci.ci_id'), '_system id'],
                [Sequelize.col('systems.ci.status.name'), '_system status'],



            ]

        }).map(data => data.toJSON())
        .then(async data => {
            let result = utils.buildObject(utils.first(data));
            let audit = await utils.getLastAudit(result.id);
            if (audit != null) result['audit'] = audit;
            res.send(result);
        }).catch(err => {
            res.status(500).send(messageErrors[301]);

        });
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
        throw new Error('311');
    }

}