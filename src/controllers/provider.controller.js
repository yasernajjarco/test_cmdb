const db = require("../index.db");
const Provider = db.provider;
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require("sequelize");
const utils = require("./utils");

exports.findAll = (req, res) => {
    const platform = req.body.platform;

    let condition = buildCondition(platform);

    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);
    db.provider.findAll({
            where: condition,
            include: [{
                model: db.platforms,
                required: false,
                as: 'platforms',
                through: { attributes: [] },
                attributes: []
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

    db.provider.findAll({
            where: { provider_id: id },
            include: [{
                model: db.application,
                required: false,
                as: 'applications',
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
            }, ],

            attributes: [
                ['provider_id', 'id'],
                ['vendor_code', 'vendor_code'],
                ['name', 'name'],
                ['address', 'address']
            ]

        }).map(data => data.toJSON())
        .then(data => {
            if (data == undefined || data.length == 0) res.send({});
            else {
                let result = utils.buildObject(utils.first(data));
                res.send(result);
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving hardwares."
            });
        });


};

exports.findForDetails = (req, res) => {

    db.provider.findAll({
            include: [{
                model: db.application,
                required: false,
                as: 'applications',
                where: { is_valid: 1 },
                include: [{ model: db.ci, required: false, as: 'ci', attributes: ['description'], }],
                attributes: [
                    ['ci_id', 'id'], 'product_code', 'version', ['end_of_support_date', 'EOS']
                ]
            }, ],

            attributes: [
                ['provider_id', 'id'],
                ['vendor_code', 'vendor_code'],
                ['name', 'name'],
            ]

        }).map(data => data.toJSON())
        .then(data => {
            if (data == undefined || data.length == 0) res.send({});
            else {
                //let result = utils.buildObject(utils.first(data));
                res.send(data);
            }
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
                attributes.push(['name', 'name']);
                break;
            case 'vendor_code':
                attributes.push(['vendor_code', 'vendor_code']);
                break;
            case 'id':
                attributes.push(['provider_id', 'id']);
                break;
            case 'address':
                attributes.push(['address', 'address']);
                break;
            case 'status':
                attributes.push(['vendor', 'vendor']);
                break;
        }


    });

    return attributes;

}

function buildCondition(platform) {
    let condition = (platform !== undefined) ? { '$platforms.name$': platform } : {};
    return condition;
}