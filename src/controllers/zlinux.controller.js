const db = require("../index.db");


const { Sequelize, DataTypes, Op } = require("sequelize");


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
                },
                {
                    model: db.client,
                    required: false,
                    as: 'clients',
                    through: { attributes: [] },
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
                        [Sequelize.col('companyname'), 'client_name'],
                        [Sequelize.col('client_id'), 'client_id']

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



            ]

        }).map(data => data.toJSON())
        .then(data => {
            res.send(first(data));
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });


};

/* ['zlinux_id', 'Id'], [Sequelize.col('domaine'), 'Domaine'], [Sequelize.col('os_version'), 'OS Version'], [Sequelize.col('cpu_type'), 'CPU Type'], [Sequelize.col('cpu_number'), 'CPU Number'],


[Sequelize.col('ci.logical_name'), 'Logical name'], [Sequelize.col('ci.ciType.name'), 'Type'], [Sequelize.col('ci.ciSubtype.name'), 'Subtype'], [Sequelize.col('ci.envType.name'), 'Environnement'], [Sequelize.col('ci.status.name'), 'Status'], [Sequelize.col('ci.description'), 'Description'], [Sequelize.col('systems.ci.logical_name'), 'System Logical Name'],

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