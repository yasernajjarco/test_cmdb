const db = require("../index.db");

const { Sequelize, DataTypes, Op } = require("sequelize");

const keyCloums = {

    'name': 'ci.our_name',
    'type': 'ci.ciType.name',
    'subtype': 'ci.ciSubtype.name',
    'environnement': 'ci.envType.name',
    'status': 'ci.status.name',
    'description': 'ci.description',
    'logical_name': 'ci.logical_name',
    'product_code': 'product_code',
    'itservice': 'itservice',
    'hardware_id': 'id',
    'ci_application_id': 'id',
    'serial_no': 'serial_no',
    'version': 'version',




}



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
                    ['ci_id', 'id'],
                    [Sequelize.col('our_name'), 'name'],
                    [Sequelize.col('ciType.name'), 'type'],
                    [Sequelize.col('ciSubtype.name'), 'subtype'],
                ]
            }

        ).map(data => data.toJSON())
        .then(data => {

            let result = data;
            db.provider.findAll({
                where: {
                    '$name$': {
                        [Op.like]: `%${name}%`
                    }
                }
            }).map(data => data.toJSON()).then(data => {
                data.forEach(element => {
                    result.push({
                        id: element.provider_id,
                        name: element.name,
                        type: "provider",
                        subtype: "provider"
                    })
                })
                db.client.findAll({
                    where: {
                        '$companyname$': {
                            [Op.like]: `%${name}%`
                        }
                    }
                }).map(data => data.toJSON()).then(data => {
                    data.forEach(element => {
                        result.push({
                            id: element.client_id,
                            name: element.companyname,
                            type: "customer",
                            subtype: "customer"
                        })
                    })
                    res.send(result);

                })

            })

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Platforms."
            });
        });
};


/* exports.findAllSearch = (req, res) => {

    const isCI = req.body.isCI;

    if (isCI) {
        getCIs(req).then(data => res.send(data));
    } else {
        res.send({ no: 'error' })
    }
}; */

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


    }

    let reg = new RegExp("_id$");
    query.attributes = new Array()
    req.body.columns.forEach(column => {
        if (reg.test(column))
            query.attributes.push([column, keyCloums[column]])
        else
            query.attributes.push([Sequelize.col(keyCloums[column]), column])

    });

    console.log(query.attributes)


    return new Promise((resolve, reject) => {
        const type = req.body.type;
        if (type == 'pserver' || type == 'storage' || type == 'netcomponent')
            getHardwares(req, query, subtype).then(data => resolve(data));
        else if (type == 'lserver')
            getVirtuels(req, query, subtype).then(data => resolve(data));
        else if (type == 'application')
            getApplications(req, query, subtype).then(data => resolve(data));
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

function getHardwares(req, query, subtype) {

    /*     req.body.columns.forEach(column => {
            query.attributes.push([Sequelize.col(column), column])

        }); */
    return new Promise((resolve, reject) => {
        db.hardwares.findAll(query)
            .then(data => {
                resolve(data);
            })
    });
}


function getApplications(req, query, subtype) {




    console.log(req.body.columns)
    return new Promise((resolve, reject) => {
        db.application.findAll(query)
            .then(data => {
                resolve(data);
            })
    });
}



function getVirtuels(req, query, subtype) {

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