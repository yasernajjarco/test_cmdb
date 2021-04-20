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