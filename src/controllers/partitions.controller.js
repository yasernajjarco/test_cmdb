const db = require("../index.db");
const utils = require("./utils");
const messageErreurs = require("../config/messageErreurs.json");
const { Sequelize, DataTypes, Op } = require("sequelize");

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


        db.ci.update({ logical_name: req.body.logical_name, description: req.body.description, our_name: req.body.name, class_service_id: class_service_id, status_id: status_id, env_type_id: environnement_id }, {
                where: { ci_id: id }
            }).then(result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update element hardware', id)
                    db.audit.create(audit)
                }
                getById(id, res)

            })
            .catch(err => {
                res.status(500).send(messageErreurs[4]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send({ error: 99, message: error.message });
        else res.status(500).send(messageErreurs[0]);
    }


};

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
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving partitions."
            });
        });
}

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