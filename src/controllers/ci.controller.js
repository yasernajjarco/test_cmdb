const db = require("../index.db");

const { Sequelize, DataTypes, Op } = require("sequelize");

exports.findAll = (req, res) => {
    const platform = req.body.platform;
    const name = req.body.name;

    let condition = (platform !== undefined) ? { '$platforms.name$': platform } : {};
    (name !== undefined) ? condition['$our_name$'] = {
        [Op.like]: `%${name}%`
    }: {};

    db.ci.findAll({
                where: condition,
                include: [
                    { model: db.platforms, required: false, as: 'platforms', attributes: [] },
                    { model: db.ciType, required: false, as: 'ciType', attributes: [], },
                    { model: db.ciSubtype, required: false, as: 'ciSubtype', attributes: [], },
                ],
                attributes: [
                    ['ci_id', 'Id'],
                    [Sequelize.col('our_name'), 'Name'],
                    [Sequelize.col('ciType.name'), 'Type'],
                    [Sequelize.col('ciSubtype.name'), 'Subtype'],
                ]
            }

        )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Platforms."
            });
        });
};


exports.findAllSearch = (req, res) => {

    const isCI = req.body.isCI;

    if (isCI) {
        getCIs(req).then(data => res.send(data));
    } else {
        res.send({ no: 'error' })
    }
};

function getCIs(req) {
    const platform = req.body.platform;
    const type = req.body.type;
    const subtype = req.body.subtype;

    let condition = buildCondition(platform, type, subtype);


    let query = {
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
        attributes: [
            ['hardware_id', 'Id'],
            [Sequelize.col('ci.our_name'), 'Name'],
            [Sequelize.col('ci.ciType.name'), 'Type'],
            [Sequelize.col('ci.ciSubtype.name'), 'Subtype'],
            [Sequelize.col('ci.envType.name'), 'Environnement'],
            [Sequelize.col('ci.status.name'), 'Status'],
            [Sequelize.col('ci.description'), 'Description'],

        ]

    }

    return new Promise((resolve, reject) => {
        const type = req.body.type;
        if (type == 'pserver' || type == 'storage' || type == 'netcomponent')
            getHardwares(query, subtype).then(data => resolve(data));
        else if (type == 'lserver')
            getVirtuels(query, subtype).then(data => resolve(data));

    });
}

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

function getHardwares(query, subtype) {

    return new Promise((resolve, reject) => {
        db.hardwares.findAll(query)
            .then(data => {
                resolve(data);
            })
    });
}



function getVirtuels(query, subtype) {

    return new Promise((resolve, reject) => {
        if (subtype == 'Mainframe System')
            getSystems(query).then(data => resolve(data));
        else if (subtype == 'zVM Linux')
            getLinuxs(query).then(data => resolve(data));
        else
            getLPARs(query).then(data => resolve(data));



    });
}

function getSystems(query) {
    return new Promise((resolve, reject) => {
        db.systems.findAll(query)
            .then(data => {
                resolve(data);
            })
    });

}

function getLinuxs(query) {
    return new Promise((resolve, reject) => {
        db.zLinux.findAll(query)
            .then(data => {
                resolve(data);
            })
    });
}

function getLPARs(query) {

    return new Promise((resolve, reject) => {
        db.lpars.findAll(query)
            .then(data => {
                resolve(data);
            })
    });
}