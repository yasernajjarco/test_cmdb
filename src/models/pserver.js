const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    PSERVER_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "PSERVER_ID"
    },
    SERIAL_NO: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "SERIAL_NO"
    },
    ENV_TYPE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ENV_TYPE_ID",
      references: {
        key: "ENV_TYPE_ID",
        model: "env_type_model"
      }
    },
    CI_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CI_ID",
      references: {
        key: "CI_ID",
        model: "ci_model"
      }
    },
    PSERVER_TYPE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "PSERVER_TYPE_ID",
      references: {
        key: "PSERVER_TYPE_ID",
        model: "pserver_type_model"
      }
    }
  };
  const options = {
    tableName: "pserver",
    comment: "",
    indexes: [{
      name: "ENV_TYPE_ID",
      unique: false,
      type: "BTREE",
      fields: ["ENV_TYPE_ID"]
    }, {
      name: "CI_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_ID"]
    }, {
      name: "PSERVER_TYPE_ID",
      unique: false,
      type: "BTREE",
      fields: ["PSERVER_TYPE_ID"]
    }]
  };
  const PserverModel = sequelize.define("pserver_model", attributes, options);
  return PserverModel;
};