const db = require("../index.db");
const ci = db.ci;
const app = db.application;
const classService = db.classService;
const utils = require("./utils");
const { Sequelize, DataTypes, Op } = require("sequelize");
const messageErrors = require("../config/messageErrors.json");

/**
 * Retrieves all elements softwares  
 * @param {Request} req the request coming from client (HTTP), it could contain the (type, subtype, platform, and columns: [])
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of software elements [] .
 * @returns {[]}   the list of software elements
 */
exports.findAll = (req, res) => {
    const platform = req.body.platform;
    const type = req.body.type;
    const subtype = req.body.subtype;
    const is_valid = req.body.is_valid;


    let condition = buildCondition(platform, type, subtype, is_valid);
    let attributes = (req.body.columns == undefined) ? [] : buildAttributes(req.body.columns);
    db.application.findAll({
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

/**
 * Retrieves one element software by id  
 * @param {Request} req the request coming from client (HTTP).
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the software element found or an empty object if it did not find an object corresponding to the sent id
 * @returns {software}  the object software found or {}
 */
exports.findById = (req, res) => {
    const id = req.params.id;
    getById(id, res);
};

/**
 * update one element software
 * @param {Request} req the request coming from client (HTTP).
 * it could contain all the modifiable attributes of a software object like (itservice, product_code ,version, end_of_support_date, end_extended_support, is_valid,isoccurenciable, name, environment, status, description, classService, last_update)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the software update object if there is no error detected, otherwise an error message
 * @returns {software}  the object software updated found or error message
 */
exports.update = async(req, res) => {
    const id = req.params.id;
    try {

        await utils.isLastUpdate(id, req.body.last_update);
        const status_id = await utils.get_status_id(req.body.status)

        db.application.update({ itservice: req.body.itservice, product_code: req.body.product_code, version: req.body.version, end_of_support_date: req.body.end_of_support_date, end_extended_support: req.body.end_extended_support, is_valid: req.body.is_valid, isoccurenciable: req.body.isoccurenciable }, {
            where: { ci_id: id }
        }).then(async result => {
            let num = result[0];
            if (num > 0) {
                let audit = utils.buildAudit('update element software', id, req.user)
                await db.audit.create(audit)
            }
            db.ci.update({ description: req.body.description, our_name: req.body.name, status_id: status_id }, {
                where: { ci_id: id }
            }).then(async result => {
                let num = result[0];
                if (num > 0) {

                    let audit = utils.buildAudit('update element software', id, req.user)
                    await db.audit.create(audit)
                }

            })
        }).then(all => {
            getById(id, res)
        }).catch(err => {
            res.status(500).send(messageErrors[502]);
        });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }



};

/**
 * add provider to element software 
 * @param {Request} req the request coming from client (HTTP).
 * it could contain the id of the provider to which the relation should be added like {id, last_update}
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the software update object if there is no error detected, otherwise an error message
 * @returns {software}  the object software updated found or error message
 */
exports.addProvider = async(req, res) => {
    const id = req.params.id;

    try {
        await utils.isLastUpdate(id, req.body.last_update);
        let provider_id = req.body.id
        let ci_application_id = await getIdApp(id)


        db.application.update({ provider_id: provider_id }, { where: { ci_application_id: ci_application_id } }

            ).then(async result => {
                let num = result[0];
                if (num > 0) {
                    let audit = utils.buildAudit('update relation software-provider', id, req.user)
                    db.audit.create(audit)
                }
                getById(id, res)
            })
            .catch(err => {
                res.send(messageErrors[503]);
            });
    } catch (error) {
        if (error.message != undefined) res.status(500).send(messageErrors[error.message]);
        else res.status(500).send(messageErrors[0]);
    }


};


/**
 * 
 * @param {[]} columns the list of columns that should be placed in the requested object
 * @returns an array with the key and the value (the field name) of each column for Sequelize
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
            case 'logical_name':
                attributes.push([Sequelize.col('ci.logical_name'), 'logical_name']);
                break;
            case 'platform':
                attributes.push([Sequelize.col('ci.platforms.name'), 'platform']);
                break;
            case 'id':
                attributes.push(['ci_id', 'id']);
                break;
            case 'version':
                attributes.push(['version', 'version']);
                break;
            case 'product_code':
                attributes.push(['product_code', 'product_code']);
                break;
            case 'end_of_support_date':
                attributes.push(['end_of_support_date', 'end_of_support_date']);
                break;
            case 'end_extended_support':
                attributes.push(['end_extended_support', 'end_extended_support']);
                break;
        }


    });

    return attributes;

}

/**
 * 
 * @param {Sting} platform  the name of the platform (Z, B, I)
 * @param {Sting} type the name of type (pserver, ...)
 * @param {Sting} subtype the name of subtype (Mainframe IBM, ...)
 * @param {Integer} is_valid the value of software (1 => software is validate by admin , 0 or null => software not yet validate by admin)
 * @returns an object which allows to make the where clause for the mysql request with Sequelize
 */
function buildCondition(platform, type, subtype, is_valid) {
    console.log(platform)
    let condition = (platform !== undefined) ? { '$ci.platforms.name$': platform } : {};

    (type !== undefined) ? condition['$ci.ciType.name$'] = {
        [Op.like]: `%${type}%`
    }: {};
    (subtype !== undefined) ? condition['$ci.ciSubtype.name$'] = {
        [Op.like]: `%${subtype}%`
    }: {};
    (is_valid !== undefined) ? condition['$is_valid$'] = {
        [Op.eq]: is_valid
    }: {};

    return condition;
}


/**
 * 
 * @param {Integer} id  id of element ci
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @returns object for the element found on the basis of its id, the result is based on the response to the Sequelize request (see documentation https://sequelize.org/master/manual/model-querying-basics.html )
 */
function getById(id, res) {
    db.application.findAll({
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
                    model: db.instance,
                    required: false,
                    as: 'instance',
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
                },
                {
                    model: db.provider,
                    required: false,
                    as: 'provider',
                    attributes: ['vendor_code']
                },


            ],
            attributes: [
                ['ci_id', 'id'],
                [Sequelize.col('ci.our_name'), 'name'],
                [Sequelize.col('ci.ciType.name'), 'type'],
                [Sequelize.col('ci.ciSubtype.name'), 'subtype'],
                [Sequelize.col('ci.status.name'), 'status'],
                [Sequelize.col('ci.description'), 'description'],
                [Sequelize.col('ci.nrb_managed_by'), 'nrb_managed_by'],
                [Sequelize.col('ci.platforms.name'), 'platform'],

                ['itservice', 'itservice'],
                ['product_code', 'product_code'],
                ['version', 'version'],
                ['end_of_support_date', 'end_of_support_date'],
                ['end_extended_support', 'end_extended_support'],
                ['is_valid', 'is_valid'],
                ['isoccurenciable', 'isoccurenciable'],

                [Sequelize.col('provider.provider_id'), '_provider id'],
                [Sequelize.col('provider.vendor_code'), '_provider vendor_code'],
                [Sequelize.col('provider.name'), '_provider name'],


            ]

        }).map(data => data.toJSON())
        .then(async data => {
            let result = utils.buildObject(utils.first(data));
            let audit = await utils.getLastAudit(result.id);
            if (audit != null) result['audit'] = audit;
            res.send(result);
        }).catch(err => {
            res.status(500).send(messageErrors[501]);

        });
}

/**
 * 
 * @param {Integer} ci_id id of element ci
 * @returns ci_application_id of element software where his ci_id if can be found, else return Exception 
 */
async function getIdApp(id) {
    try {
        let step1 = await db.application.findOne({ where: { ci_id: id }, attributes: ['ci_application_id'] })
        return step1.dataValues.ci_application_id;
    } catch (error) {
        throw new Error('511');
    }

}