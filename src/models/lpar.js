const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    LPAR_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "LPAR_ID"
    },
    HOST_CI: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "HOST_CI"
    },
    HOST_TYPE: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "HOST_TYPE"
    },
    Pserver_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Pserver_ID",
      references: {
        key: "Pserver_ID",
        model: "pserver_model"
      }
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
    }
  };
  const options = {
    tableName: "lpar",
    comment: "",
    indexes: [{
      name: "Pserver_ID",
      unique: false,
      type: "BTREE",
      fields: ["Pserver_ID"]
    }, {
      name: "ENV_TYPE_ID",
      unique: false,
      type: "BTREE",
      fields: ["ENV_TYPE_ID"]
    }, {
      name: "CI_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_ID"]
    }]
  };
  const LparModel = sequelize.define("lpar_model", attributes, options);
  return LparModel;
};