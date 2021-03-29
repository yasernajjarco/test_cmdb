const db = require("../index.db");
const Provider = db.provider;
const Op = db.Sequelize.Op;
const { Sequelize, DataTypes } = require("sequelize");
const utils = require("./utils");

exports.findAll = (req, res) => {

    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);
    db.client.findAll({
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

    db.client.findAll({
            where: { client_id: id },
            include: [{
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


                        ],
                        attributes: ['our_name', ['ci_id', 'id']]
                    }],
                    attributes: [
                        ['ci_id', 'id']
                    ]
                },

                {
                    model: db.zLinux,
                    required: false,
                    as: 'zLinux',
                    through: { attributes: [] },
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
                        ['ci_id', 'id']
                    ]
                },
                {
                    model: db.instance,
                    required: false,
                    as: 'instances',
                    through: { attributes: [] },
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
                        ['ci_id', 'id']
                    ]
                },
                {
                    model: db.occurence,
                    required: false,
                    as: 'occurences',
                    through: { attributes: [] },
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
                        ['ci_id', 'id']
                    ]
                },
                {
                    model: db.contact,
                    required: false,
                    as: 'contacts',
                    attributes: [
                        ['contact_id', 'id'],
                        ['lastname', 'lastname'],
                        ['firstname', 'firstname']
                    ]
                },

            ],

            attributes: [
                ['client_id', 'id'],
                ['companyname', 'name'],
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
                attributes.push(['companyname', 'name']);
                break;
            case 'address':
                attributes.push(['address', 'address']);
                break;
            case 'id':
                attributes.push(['client_id', 'id']);
                break;
        }


    });

    return attributes;

}