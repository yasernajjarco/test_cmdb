const db = require("../index.db");


const { Sequelize, DataTypes, Op } = require("sequelize");


exports.findAll = (req, res) => {
    const platform = req.body.platform;
    let condition = (platform !== undefined) ? { '$ci.platforms.name$': platform } : {};

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
            attributes: [
                ['systeme_id', 'Id'],
                [Sequelize.col('ci.logical_name'), 'Logical name'],
                [Sequelize.col('ci.ciType.name'), 'Type'],
                [Sequelize.col('ci.ciSubtype.name'), 'Subtype'],
                [Sequelize.col('ci.envType.name'), 'Environnement'],
                [Sequelize.col('ci.status.name'), 'Status'],
                [Sequelize.col('ci.description'), 'Description'],
                [Sequelize.col('lpars.host_ci'), 'LPAR Host ci'],
                [Sequelize.col('lpars.host_type'), 'LPAR Host Type'],
                [Sequelize.col('lpars.ci.our_name'), 'LPAR Our Name'],



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


exports.findLinux = (req, res) => {
    db.zLinux.findAll({
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
                },
                {
                    model: db.client,
                    required: false,
                    as: 'clients',
                    through: { attributes: [] },
                    attributes: [
                        // [Sequelize.col('companyname'), 'client_name']

                    ]
                },



            ],
            attributes: [
                ['zlinux_id', 'Id'],
                [Sequelize.col('domaine'), 'Domaine'],
                [Sequelize.col('os_version'), 'OS Version'],
                [Sequelize.col('cpu_type'), 'CPU Type'],
                [Sequelize.col('cpu_number'), 'CPU Number'],


                [Sequelize.col('ci.logical_name'), 'Logical name'],
                [Sequelize.col('ci.ciType.name'), 'Type'],
                [Sequelize.col('ci.ciSubtype.name'), 'Subtype'],
                [Sequelize.col('ci.envType.name'), 'Environnement'],
                [Sequelize.col('ci.status.name'), 'Status'],
                [Sequelize.col('ci.description'), 'Description'],
                [Sequelize.col('systems.ci.logical_name'), 'System Logical Name'],



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