const db = require("../index.db");


const { Sequelize, DataTypes, Op } = require("sequelize");

exports.findAll = (req, res) => {
    //    const platform = req.query.id;
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
                    attributes: [
                        //     [Sequelize.col('serial_no'), 'serial_no']
                    ]
                },
                {
                    model: db.client,
                    required: false,
                    as: 'clients',
                    through: { attributes: [] },
                    attributes: [
                        //   [Sequelize.col('companyname'), 'client_name']

                    ]
                },


            ],
            attributes: attributes
                /*
                    [Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.name"), '_', Sequelize.col("ci.our_name")), 'Displayname']
                    [Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.prefixe"), '_', Sequelize.col("ci.our_name")), 'Displayname']

                */


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


exports.findById = (req, res) => {

    const id = req.params.id;

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
                            { model: db.ciType, required: false, as: 'ciType', attributes: ['name'] }

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
                            { model: db.ciType, required: false, as: 'ciType', attributes: ['name'] }


                        ],
                        attributes: ['our_name', ['ci_id', 'id'], 'des']

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
                        [Sequelize.col('companyname'), 'client_name'],
                        [Sequelize.col('client_id'), 'client_id']

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

            ]

        }).map(data => data.toJSON())
        .then(data => {
            let result = data[0];
            if (result != null && result != undefined && result.hardwares1 != undefined && result.hardwares1.length > 0) {
                result.hardwares1.forEach(element => result.hardwares.push(element));
            }
            delete result.hardwares1;
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });


};