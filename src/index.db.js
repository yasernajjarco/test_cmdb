const config = require("./config/config");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: 0,
        define: {
            timestamps: false
        },
        dialectOptions: {
            useUTC: false
        },
        timezone: '+02:00',

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
db.ci = require("./models/ci")(sequelize, Sequelize, DataTypes);
db.provider = require("./models/provider")(sequelize, Sequelize, DataTypes);
db.application = require("./models/ci_application")(sequelize, Sequelize, DataTypes);
db.instance = require("./models/instance")(sequelize, Sequelize, DataTypes);
db.provider_platform = require("./models/provider_platform")(sequelize, Sequelize, DataTypes);
db.lpars = require("./models/lpar")(sequelize, Sequelize, DataTypes);
db.hardwares = require("./models/hardware")(sequelize, Sequelize, DataTypes);
db.zLinux = require("./models/zlinux")(sequelize, Sequelize, DataTypes);
db.systems = require("./models/systeme")(sequelize, Sequelize, DataTypes);
db.hardwares_relations = require("./models/hardware_relation")(sequelize, Sequelize, DataTypes);
db.ciType = require("./models/ci_type")(sequelize, Sequelize, DataTypes);
db.ciSubtype = require("./models/ci_subtype")(sequelize, Sequelize, DataTypes);
db.client = require("./models/client")(sequelize, Sequelize, DataTypes);
db.client_zlinux = require("./models/client_zlinux")(sequelize, Sequelize, DataTypes);
db.client_hardware = require("./models/client_hardware")(sequelize, Sequelize, DataTypes);
db.client_systeme = require("./models/client_systeme")(sequelize, Sequelize, DataTypes);

db.occurence = require("./models/occurencesoft")(sequelize, Sequelize, DataTypes);

db.occurence_client = require("./models/occurence_client")(sequelize, Sequelize, DataTypes);

db.contact = require("./models/contact")(sequelize, Sequelize, DataTypes);
db.audit = require("./models/audit")(sequelize, Sequelize, DataTypes);


//=============== CI ================//
db.platforms.hasMany(db.ci, { foreignKey: 'platform_id', as: "ci" });
db.ci.belongsTo(db.platforms, { foreignKey: 'platform_id', as: "platforms" });

db.ciType.hasMany(db.ci, { foreignKey: 'ci_type_id', as: "ci" });
db.ci.belongsTo(db.ciType, { foreignKey: 'ci_type_id', as: "ciType" });

db.ciSubtype.hasMany(db.ci, { foreignKey: 'ci_subtype_id', as: "ci" });
db.ci.belongsTo(db.ciSubtype, { foreignKey: 'ci_subtype_id', as: "ciSubtype" });


db.status.hasMany(db.ci, { foreignKey: 'status_id', as: "ci" });
db.ci.belongsTo(db.status, { foreignKey: 'status_id', as: "status" });

db.classService.hasMany(db.ci, { foreignKey: 'class_service_id', as: "ci" });
db.ci.belongsTo(db.classService, { foreignKey: 'class_service_id', as: "classService" });

db.envType.hasMany(db.ci, { foreignKey: 'env_type_id', as: "ci" });
db.ci.belongsTo(db.envType, { foreignKey: 'env_type_id', as: "envType" });
//===============================//



//=============== hardwares ================//
db.ci.hasMany(db.hardwares, { foreignKey: 'ci_id', as: "hardwares" });
db.hardwares.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });

/* db.hardwares.belongsToMany(db.hardwares, { through: "hardware_relation", as: "hardwares", foreignKey: "hardware_id" });
db.hardwares.belongsToMany(db.hardwares, { through: "hardware_relation", as: "hardwares1", foreignKey: "hardware_id_1" });
 */
db.hardwares.belongsToMany(db.hardwares, { as: 'hardwares', through: { model: db.hardwares_relations, unique: false }, foreignKey: 'hardware_id' });
db.hardwares.belongsToMany(db.hardwares, { as: 'hardwares1', through: { model: db.hardwares_relations, unique: false }, foreignKey: 'hardware_id_1' });



db.hardwares.belongsToMany(db.client, { through: "client_hardware", as: "clients", foreignKey: "hardware_id" });
db.client.belongsToMany(db.hardwares, { through: "client_hardware", as: "hardwares", foreignKey: "client_id" });
//===============================//


//=============== LPAR ================//
db.ci.hasMany(db.lpars, { foreignKey: 'ci_id', as: "lpars" });
db.lpars.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });

db.hardwares.hasMany(db.lpars, { foreignKey: "hardware_id", as: "lpars" });
db.lpars.belongsTo(db.hardwares, { foreignKey: "hardware_id", as: "hardwares" });

//===============================//


//=============== application ================//
db.ci.hasMany(db.application, { foreignKey: 'ci_id', as: "application" });
db.application.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });

//===============================//


//=============== systems ================//

db.ci.hasMany(db.systems, { foreignKey: 'ci_id', as: "systems" });
db.systems.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });

db.lpars.hasMany(db.systems, { foreignKey: 'lpar_id', as: "systems" });
db.systems.belongsTo(db.lpars, { foreignKey: 'lpar_id', as: "lpars" });


/* db.systems.belongsTo(db.client, { foreignKey: 'client_id', as: "clients" });
db.client.hasMany(db.systems, { foreignKey: 'client_id', as: "systems" }); */

db.systems.belongsToMany(db.client, { through: "client_systeme", as: "clients", foreignKey: "systeme_id" });
db.client.belongsToMany(db.systems, { through: "client_systeme", as: "systems", foreignKey: "client_id" });

//===============================//



//=============== ZLinux ================//

db.ci.hasMany(db.zLinux, { foreignKey: 'ci_id', as: "zLinux" });
db.zLinux.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });

db.systems.hasMany(db.zLinux, { foreignKey: 'systeme_id', as: "zLinuxs" });
db.zLinux.belongsTo(db.systems, { foreignKey: 'systeme_id', as: "systems" });


db.zLinux.belongsToMany(db.client, { through: "client_zlinux", as: "clients", foreignKey: "zlinux_id" });
db.client.belongsToMany(db.zLinux, { through: "client_zlinux", as: "zLinux", foreignKey: "client_id" });

//===============================//




//=============== instance ================//

db.ci.hasMany(db.instance, { foreignKey: 'ci_id', as: "instance" });
db.instance.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });

db.systems.hasMany(db.instance, { foreignKey: 'systeme_id', as: "instances" });
db.instance.belongsTo(db.systems, { foreignKey: 'systeme_id', as: "systems" });


/* db.instance.belongsToMany(db.client, { through: "instance_client", as: "clients", foreignKey: "instance_id" });
db.client.belongsToMany(db.instance, { through: "instance_client", as: "instances", foreignKey: "client_id" }); */


db.application.hasMany(db.instance, { foreignKey: 'ci_application_id', as: "instance" });
db.instance.belongsTo(db.application, { foreignKey: 'ci_application_id', as: "application" });

db.instance.hasMany(db.occurence, { foreignKey: 'instance_id', as: "occurences" });
db.occurence.belongsTo(db.instance, { foreignKey: 'instance_id', as: "instance" });

//===============================//


//=============== occurence ================//

db.ci.hasMany(db.occurence, { foreignKey: 'ci_id', as: "occurence" });
db.occurence.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });

db.occurence.belongsToMany(db.client, { through: "occurence_client", as: "clients", foreignKey: "occurencesoft_id" });
db.client.belongsToMany(db.occurence, { through: "occurence_client", as: "occurences", foreignKey: "client_id" });

//===============================//

db.provider.belongsToMany(db.platforms, { through: "provider_platform", as: "platforms", foreignKey: "provider_id" });
db.platforms.belongsToMany(db.provider, { through: "provider_platform", as: "providers", foreignKey: "platform_id" });




db.provider.hasMany(db.application, { foreignKey: 'provider_id', as: "applications" });
db.application.belongsTo(db.provider, { foreignKey: 'provider_id', as: "provider" });

db.client.hasMany(db.contact, { foreignKey: 'client_id', as: "contacts" });
db.contact.belongsTo(db.client, { foreignKey: 'client_id', as: "client" });

//=============== audit ================//

db.ci.hasMany(db.audit, { foreignKey: 'ci_id', as: "audit" });
db.audit.belongsTo(db.ci, { foreignKey: 'ci_id', as: "ci" });


/*

db.ci.hasMany(db.storages, { foreignKey: 'ci_id', as : "storage"});
db.storages.belongsTo(db.ci, {foreignKey: 'ci_id', as: "ci"}); */


module.exports = db;