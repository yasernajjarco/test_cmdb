const config = require("../config/config.js");
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


db.platforms = require("./platform")(sequelize, Sequelize, DataTypes);
db.status = require("./status")(sequelize, Sequelize, DataTypes);
db.classService = require("./class_service")(sequelize, Sequelize, DataTypes);
db.envType = require("./env_type")(sequelize, Sequelize, DataTypes);
db.pserverType = require("./pserver_type")(sequelize, Sequelize, DataTypes);
db.storageType = require("./storage_type")(sequelize, Sequelize, DataTypes);





 



module.exports = db;
