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

// db.persons = require("./persons.js")(sequelize, Sequelize, DataTypes);
// db.orders = require("./orders.js")(sequelize, Sequelize, DataTypes);

// db.persons.hasMany(db.orders, { as: "orders" });
// db.orders.belongsTo(db.persons, {
//   foreignKey: "PersonID",
//   as: "persons",
// });


db.platforms = require("./models/platform")(sequelize, Sequelize, DataTypes);
db.status = require("./models/status")(sequelize, Sequelize, DataTypes);
db.classService = require("./models/class_service")(sequelize, Sequelize, DataTypes);
db.envType = require("./models/env_type")(sequelize, Sequelize, DataTypes);
db.pserverType = require("./models/pserver_type")(sequelize, Sequelize, DataTypes);
db.storageType = require("./models/storage_type")(sequelize, Sequelize, DataTypes);
db.ci = require("./models/ci")(sequelize, Sequelize, DataTypes);

/*  db.platforms.hasMany(db.ci, { as: "ci" });
db.ci.belongsTo(db.platforms, {
  foreignKey: ".platform_id",
  as: "platform",
});  */



 



module.exports = db;
