const db = require("../index.db");


const { Sequelize, DataTypes, Op } = require("sequelize");


exports.findAll = (req, res) => {
    const platform = req.body.platform;
    let condition = (platform !== undefined) ? { '$ci.platforms.name$': platform } : {};

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

                    ]

                },
                { model: db.envType, required: false, as: 'envType', attributes: [] },
                {
                    model: db.hardwares,
                    required: false,
                    as: 'hardwares',
                    through: { attributes: [] },
                    attributes: [
                        [Sequelize.col('serial_no'), 'serial_no']
                    ]
                },
                {
                    model: db.client,
                    required: false,
                    as: 'clients',
                    through: { attributes: [] },
                    attributes: [
                        [Sequelize.col('companyname'), 'client_name']

                    ]
                },

            ],
            attributes: [
                ['hardware_id', 'id'],
                [Sequelize.col('ci.ci_id'), 'ci_id'],
                [Sequelize.col('ci.platforms.name'), 'platform'],
                [Sequelize.col('ci.status.name'), 'status'],
                [Sequelize.col('ci.classService.name'), 'classService'],
                [Sequelize.col('ci.ciType.name'), 'Type'],
                [Sequelize.col('ci.ciSubtype.name'), 'Subtype'],
                [Sequelize.col('envType.name'), 'enveType'],
                [Sequelize.col('ci.description'), 'description'],
                [Sequelize.col('ci.our_name'), 'our_name'],
                [Sequelize.col('ci.nrb_managed_by'), 'nrb_managed_by'],
                [Sequelize.fn('CONCAT', Sequelize.col("ci.platforms.name"), '_', Sequelize.col("ci.our_name")), 'displayname']

            ]

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