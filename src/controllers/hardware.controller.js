const db = require("../index.db");
const utils = require("./utils");
const messageErreurs = require("../config/messageErreurs.json");
const { Sequelize, DataTypes, Op } = require("sequelize");
const hardware_relation = require("../models/hardware_relation");

exports.findAll = (req, res) => {
    const platform = req.body.platform;
    const type = req.body.type;
    const subtype = req.body.subtype;

    let condition = buildCondition(platform, type, subtype);
    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);

    db.hardwares.findAll({
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
                    through: { attributes: [] },
                    attributes: []
                },
                {
                    model: db.client,
                    required: false,
                    as: 'clients',
                    through: { attributes: [] },
                    attributes: []
                },


            ],
            attributes: attributes
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
            else res.status(500).send(messageErreurs[0]);
        });
};

exports.findById = (req, res) => {
    const id = req.params.id;

    getById(id, res);


};

exports.update = async(req, res) => {
    const id = req.params.id;
    try {

        await utils.isLastUpdate(id, req.body.last_update);
        const class_service_id = await utils.get_classService_id(req.body.classService)
        const status_id = await utils.get_status_id(req.body.status)
        const environnement_id = await utils.get_environnement_id(req.body.environnement)

        db.hardwares.update({ serial_no: req.body.serial_no }, {
            where: { ci_id: id }
        }).then(async result => {
            let num = result[0];
            if (num > 0) {
                let audit = utils.buildAudit('update element hardware', id, req.user)
                await db.audit.create(audit)
            }
            db.ci.update({ description: req.body.description, our_name: req.body.name, class_service_id: class_service_id, status_id: status_id, env_type_id: environnement_id }, {
                where: { ci_id: id }
            }).then(async result => {
                let num = result[0];
                if (num > 0) {

                    let audit = utils.buildAudit('update element hardware', id, req.user)
                    await db.audit.create(audit)
                }

            })
        }).then(all => {
            getById(id, res)
        }).catch(err => {
            res.status(500).send(messageErreurs[104]);
        });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }



};

exports.addRelation = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);

        let hardware_id = await getId(id)
        let hardware_id_1 = await getId(req.body.id)

        db.hardwares_relations.findOrCreate({
                where: {
                    [Op.or]: [{
                        hardware_id: hardware_id,
                        hardware_id_1: hardware_id_1

                    }, {
                        hardware_id: hardware_id_1,
                        hardware_id_1: hardware_id

                    }]

                },
                defaults: {
                    hardware_id: hardware_id,
                    hardware_id_1: hardware_id_1

                }
            }).then(async num => {
                if (num[0]._options.isNewRecord) {
                    let audit = utils.buildAudit('update relation hardware', id, req.user)
                    await db.audit.create(audit)
                    getById(id, res)

                } else {
                    res.send(messageErreurs[108]);
                }
            })
            .catch(err => {
                res.send(messageErreurs[106]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }


};

exports.deleteRelation = async(req, res) => {
    const id = req.params.id;
    try {
        await utils.isLastUpdate(id, req.body.last_update);

        let hardware_id = await getId(id)
        let hardware_id_1 = await getId(req.body.id)

        db.hardwares_relations.destroy({
                where: {
                    [Op.or]: [{
                        hardware_id: hardware_id,
                        hardware_id_1: hardware_id_1

                    }, {
                        hardware_id: hardware_id_1,
                        hardware_id_1: hardware_id

                    }]
                }
            }).then(async num => {
                if (num > 0) {
                    let audit = utils.buildAudit('remove relation hardware-hardware', id, req.user)
                    await db.audit.create(audit)
                    getById(id, res)

                } else {
                    res.send(messageErreurs[105]);
                }
            })
            .catch(err => {
                res.status(500).send(messageErreurs[106]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }



};

exports.addClient = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);

        let hardware_id = await getId(id)
        let client_id = req.body.id

        db.client_hardware.findOrCreate({
                where: {
                    [db.Op.and]: [{ client_id: client_id, hardware_id: hardware_id }]
                },
                defaults: {
                    client_id: client_id,
                    hardware_id: hardware_id

                }
            }).then(num => {
                if (num[0]._options.isNewRecord) {
                    db.audit.create({
                        audittimestamp: Sequelize.fn('NOW'),
                        audituser: req.user,
                        auditdescription: 'update relation hardware',
                        ci_id: id
                    })
                    getById(id, res)
                } else {
                    res.send(messageErreurs[7]);
                }
            })
            .catch(err => {
                res.status(500).send(messageErreurs[3]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }



};

exports.deleteClient = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);

        let hardware_id = await getId(id)
        let client_id = req.body.id

        db.client_hardware.destroy({
                where: {
                    [db.Op.and]: [{ client_id: client_id, hardware_id: hardware_id }]
                }
            }).then(async num => {
                if (num > 0) {
                    let audit = utils.buildAudit('remove relation hardware-client', id, req.user)
                    await db.audit.create(audit)
                    getById(id, res)
                } else {
                    res.status(500).send(messageErreurs[102]);
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).send(messageErreurs[103]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }



};

exports.addPartition = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);

        let hardware_id = await getId(id)
        let lpar_id = await getIdLpar(req.body.id)

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
                res.send(messageErreurs[206]);

            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }


};

exports.deletePartition = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let lpar_id = await getIdLpar(req.body.id)
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
                res.send(messageErreurs[207]);

            });
    } catch (error) {
        console.log(error)
        if (error.message != undefined) res.status(500).send(messageErreurs[error.message]);
        else res.status(500).send(messageErreurs[0]);
    }


};

function buildAttributes(columns) {
    let attributes = [];
    columns.forEach(element => {
        switch (element) {
            case 'serial_no':
                attributes.push(['serial_no', 'serial_no']);
                break;
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

function getById(id, res) {

    db.hardwares.findAll({
            where: { ci_id: id },
            required: true,
            include: [{
                    model: db.ci,
                    required: true,
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
                    model: db.hardwares,
                    required: false,
                    as: 'hardwares1',
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
                    model: db.lpars,
                    required: false,
                    as: 'lpars',
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
                        ['ci_id', 'id'],
                    ]
                },

            ],
            attributes: [
                //['hardware_id', 'id'],
                [Sequelize.col('ci.ci_id'), 'id'],
                [Sequelize.col('ci.our_name'), 'name'],
                [Sequelize.col('ci.ciType.name'), 'type'],
                [Sequelize.col('ci.ciSubtype.name'), 'subtype'],
                [Sequelize.col('ci.envType.name'), 'environnement'],
                [Sequelize.col('ci.status.name'), 'status'],
                [Sequelize.col('ci.description'), 'description'],
                [Sequelize.col('ci.classService.name'), 'classService'],
                [Sequelize.col('ci.nrb_managed_by'), 'nrb_managed_by'],
                [Sequelize.col('ci.platforms.name'), 'platform'],
                ['serial_no', 'serial_no']
            ]
        }).map(data => data.toJSON())
        .then(async(data) => {
            if (data == undefined || data.length == 0)
                res.send({});
            else {
                let result = data[0];
                let audit = await utils.getLastAudit(result.id);
                if (audit != null)
                    result['audit'] = audit;

                if (result != null && result != undefined && result.hardwares1 != undefined && result.hardwares1.length > 0) {
                    result.hardwares1.forEach(element => result.hardwares.push(element));
                }
                delete result.hardwares1;
                res.send(result);
            }
        })
        .catch(err => {
            res.status(500).send(messageErreurs[0]);
        });
}

async function getId(hardware_id) {
    try {
        let step1 = await db.hardwares.findOne({ where: { ci_id: hardware_id }, attributes: ['hardware_id'] })
        return step1.dataValues.hardware_id;
    } catch (error) {
        throw new Error('109');
    }

}

async function getIdLpar(id) {
    try {
        let step1 = await db.lpars.findOne({ where: { ci_id: id }, attributes: ['lpar_id'] })
        return step1.dataValues.lpar_id;
    } catch (error) {
        throw new Error('212');
    }

}