const db = require("../index.db");
const ci = db.ci;
const app = db.application;
const classService = db.classService;


const { Sequelize, DataTypes, Op } = require("sequelize");


exports.findAll = (req, res) => {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    // { include: ["ci"] }
    // { include: [ { all: true, nested: true }] }
    //        attributes: ['ManagerName']


    /*   include: [{
      model: db.ci,
      required: false,
      as: 'ci',
      attributes: ['company','description'],
      include: [{
        model: db.classService,
        required: false,
        as: 'classService',
        attributes: [['name','nameClass']],
    }]

  }],
  attributes: ['version', 'is_valid','ci.company']

} */


    /* {
       
      attributes: ['is_valid',['version','versionName'], [Sequelize.col('ci.classService.name'), 'service'] , [Sequelize.col('ci.company'), 'company'] ],
          include: [{
              model: db.ci,
              required: false,
              as: 'ci',
              attributes: [  ],
              include: [{
                model: db.classService,
                required: false,
                as: 'classService',
                attributes: [],
                
            }]

          }],
          
      } */



    /*   {
       
        attributes: ['is_valid',['version','versionName'], [Sequelize.col('ci.classService.name'), 'service'] , [Sequelize.col('ci.company'), 'company'] ],
            include: [{ model: db.ci, as: 'ci', attributes: [  ],
                include: [{ model: db.classService,as: 'classService',attributes: [] }]
                }],
            
      } */


    //,     [Sequelize.literal('"ci"."company"'), 'companyName']
    app.findAll({

            include: [{
                    model: db.ci,
                    required: false,
                    as: 'ci',
                    attributes: [],
                    include: [{ model: db.platforms, required: false, as: 'platforms', attributes: [], }]
                },
                {
                    model: db.instance,
                    required: false,
                    as: 'instance',
                    attributes: ['name'],
                },
                {
                    model: db.provider,
                    required: false,
                    as: 'provider',
                    attributes: [],
                }

            ],
            attributes: ['version', 'is_valid', [Sequelize.col('ci.platforms.name'), 'platform'],
                [Sequelize.col('provider.name'), 'providerName'],
                [Sequelize.col('ci.company'), 'company'],
                [Sequelize.col('ci.description'), 'description']
            ]

        })
        .then(data => {

            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Platforms."
            });
        });
};




exports.findByIdProvider = (req, res) => {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    //{ include: ["application"] }
    const id = req.params.id;

    app.findAll({
            include: [{
                    model: db.ci,
                    required: false,
                    as: 'ci',
                    attributes: [],
                    include: [{ model: db.platforms, required: false, as: 'platforms', attributes: [], }]
                },
                {
                    model: db.instance,
                    required: false,
                    as: 'instance',
                    attributes: ['name'],
                },
                {
                    model: db.provider,
                    required: true,
                    as: 'provider',
                    where: { provider_id: id },
                }

            ],
            attributes: ['version', 'product_code', 'is_valid', [Sequelize.col('provider.name'), 'providerName'],
                [Sequelize.col('ci.company'), 'company'],
                [Sequelize.col('ci.description'), 'description']
            ]

        })
        .then(data => {

            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Platforms."
            });
        });
};

exports.findByIdPlatform = (req, res) => {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    //{ include: ["application"] }
    const id = req.body.platform_id;
    console.log(id)
    app.findAll({
            include: [{
                    model: db.ci,
                    required: true,
                    as: 'ci',
                    attributes: [],
                    include: [{ model: db.platforms, required: true, as: 'platforms', where: { platform_id: id } }]
                },
                {
                    model: db.instance,
                    required: false,
                    as: 'instance',
                    attributes: ['name'],
                },
                {
                    model: db.provider,
                    required: true,
                    as: 'provider',
                    attributes: [],
                }

            ],
            attributes: ['version', 'product_code', 'is_valid', [Sequelize.col('provider.name'), 'providerName'],
                [Sequelize.col('ci.company'), 'company'],
                [Sequelize.col('ci.description'), 'description']
            ]

        })
        .then(data => {

            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Platforms."
            });
        });
};