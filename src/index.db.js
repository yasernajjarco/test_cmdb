const config = require("./config/config");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,
    define: {
      timestamps: false
    },

    poll: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);


const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;



db.platforms = require("./models/platform")(sequelize, Sequelize, DataTypes);
db.status = require("./models/status")(sequelize, Sequelize, DataTypes);
db.classService = require("./models/class_service")(sequelize, Sequelize, DataTypes);
db.envType = require("./models/env_type")(sequelize, Sequelize, DataTypes);
db.pserverType = require("./models/pserver_type")(sequelize, Sequelize, DataTypes);
db.storageType = require("./models/storage_type")(sequelize, Sequelize, DataTypes);
db.ci = require("./models/ci")(sequelize, Sequelize, DataTypes);
db.provider = require("./models/provider")(sequelize, Sequelize, DataTypes);
db.application = require("./models/ci_application")(sequelize, Sequelize, DataTypes);
db.instance = require("./models/instance")(sequelize, Sequelize, DataTypes);
db.provider_platform = require("./models/provider_platform")(sequelize, Sequelize, DataTypes);



db.platforms.hasMany(db.ci, { foreignKey: 'platform_id', as : "ci"});
db.ci.belongsTo(db.platforms, {foreignKey: 'platform_id', as: "platforms"});

db.status.hasMany(db.ci, { foreignKey: 'status_id', as : "ci"});
db.ci.belongsTo(db.status, {foreignKey: 'status_id', as: "status"});

db.classService.hasMany(db.ci, { foreignKey: 'class_service_id', as : "ci"});
db.ci.belongsTo(db.classService, {foreignKey: 'class_service_id', as: "classService"});

db.provider.hasMany(db.application, { foreignKey: 'provider_id', as : "application"});
db.application.belongsTo(db.provider, {foreignKey: 'provider_id', as: "provider"});


db.ci.hasMany(db.application, { foreignKey: 'ci_id', as : "application"});
db.application.belongsTo(db.ci, {foreignKey: 'ci_id', as: "ci"});

db.application.hasMany(db.instance, { foreignKey: 'ci_application_id', as : "instance"});
db.instance.belongsTo(db.application, {foreignKey: 'ci_application_id', as: "application"});

module.exports = db;


