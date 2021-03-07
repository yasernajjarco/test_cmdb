const db = require("../index.db");
const ci = db.ci;
const app = db.application;
const classService = db.classService;


const { Sequelize, DataTypes, Op } = require("sequelize");

exports.findAll = (req, res) => {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    //{ include: ["ci"] }
    ci.findAll({ include: ["platforms", "status", "classService"] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Platforms."
            });
        });
};


exports.findAllApp = (req, res) => {
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
                    include: [{ model: db.classService, required: false, as: 'classService', attributes: [], }]
                },
                {
                    model: db.instance,
                    required: false,
                    as: 'instance',
                    attributes: ['name'],
                }

            ],
            attributes: ['version', 'is_valid', [Sequelize.col('ci.classService.name'), 'service'],
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