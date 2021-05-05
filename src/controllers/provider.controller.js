const db = require("../index.db");
const utils = require("./utils");
const messageErrors = require("../config/messageErrors.json");

/**
 * Retrieves all providers  
 * @param {Request} req the request coming from client (HTTP), it could contain the ( platform, and columns: [])
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the list of providers [] .
 * @returns {[]}   the list of providers
 */
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

/**
 * Retrieves one provider by id  
 * @param {Request} req the request coming from client (HTTP).
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the  provider found or an empty object if it did not find an object corresponding to the sent id
 * @returns {provider}  the object provider found or {}
 */
exports.findById = (req, res) => {

    const id = req.params.id;
    getById(id, res);

};

/**
 * Retrieves one provider by id  
 * @param {Request} req the request coming from client (HTTP).
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the provider found or an empty object if it did not find an object corresponding to the sent id
 * @returns {provider}  the object provider with app his apps found or {}
 */
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


/**
 * update one provider
 * @param {Request} req the request coming from client (HTTP).
 * it could contain all the modifiable attributes of a software object like (vendor_code,name, vendor)
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request, 
 * it could contain the provider update object if there is no error detected, otherwise an error message
 * @returns {software}  the object provider updated found or error message
 */
exports.update = async(req, res) => {
    const id = req.params.id;
    try {
        db.provider.update({ vendor_code: req.body.vendor_code, name: req.body.name, vendor: req.body.vendor }, {
                where: { provider_id: id }
            }).then(result => {
                getById(id, res)
            })
            .catch(err => {
                res.status(500).send(messageErrors[602]);
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

/**
 * 
 * @param {Sting} platform  the name of the platform (Z, B, I)
 * @returns an object which allows to make the where clause for the mysql request with Sequelize
 */
function buildCondition(platform) {
    let condition = (platform !== undefined) ? { '$platforms.name$': platform } : {};
    return condition;
}

/**
 * 
 * @param {Integer} id  id of provider
 * @param {Response} res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @returns object for the element found on the basis of its id, the result is based on the response to the Sequelize request (see documentation https://sequelize.org/master/manual/model-querying-basics.html )
 */
function getById(id, res) {
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
                ['vendor', 'vendor'],
                ['address', 'address'],

            ]

        }).map(data => data.toJSON())
        .then(data => {
            if (data == undefined || data.length == 0) res.send({});
            else {
                let result = utils.buildObject(utils.first(data));
                res.send(result);
            }
        }).catch(err => {
            res.status(500).send(messageErrors[601]);
        });
}