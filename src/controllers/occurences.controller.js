const db = require("../index.db");
const utils = require("./utils");


const { Sequelize, DataTypes, Op } = require("sequelize");


exports.findAll = (req, res) => {
    const platform = req.body.platform;
    const type = req.body.type;
    const subtype = req.body.subtype;

    let condition = buildCondition(platform, type, subtype);
    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);
    db.occurence.findAll({
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
            }, ],
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

    db.occurence.findAll({
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
                    model: db.client,
                    required: false,
                    as: 'clients',
                    through: { attributes: [] },
                    attributes: [
                        [Sequelize.col('companyname'), 'client_name'],
                        [Sequelize.col('client_id'), 'client_id']

                    ]
                },
                {
                    model: db.instance,
                    required: false,
                    as: 'instance',
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
                [Sequelize.col('instance.ci.our_name'), '_instance name'],
                [Sequelize.col('instance.ci.ciSubtype.name'), '_instance subtype'],
                [Sequelize.col('instance.ci.ciType.name'), '_instance type'],
                [Sequelize.col('instance.ci.ci_id'), '_instance id'],


            ]

        }).map(data => data.toJSON())
        .then(data => {
            let result = utils.buildObject(utils.first(data));
            res.send(result);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });


};


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

function first(array) {
    if (array == null)
        return {};
    if (array.length == 0)
        return {}
    return array[0];
};