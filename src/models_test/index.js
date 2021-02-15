const config = require("../config/config.js");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  'nodedb',
  'root',
  'rootroot',
  {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: 0,
    define: {
      timestamps: false
  },

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle
    }
  }
);


const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.persons = require("./persons.js")(sequelize, Sequelize, DataTypes);
db.orders = require("./orders.js")(sequelize, Sequelize, DataTypes);




 db.persons.hasMany(db.orders, { as: "orders" });
db.orders.belongsTo(db.persons, {
  foreignKey: "PersonID",
  as: "persons",
});
 



module.exports = db;
