const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    CI_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "CI_ID"
    },
    LOGICAL_NAME: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "LOGICAL_NAME"
    },
    COMPANY: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "COMPANY"
    },
    NRB_MANAGED_BY: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "NRB_MANAGED_BY"
    },
    DESCRIPTION: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "DESCRIPTION"
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    },
    CLASS_SERVICE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CLASS_SERVICE_ID",
      references: {
        key: "CLASS_SERVICE_ID",
        model: "class_service_model"
      }
    },
    Platform_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Platform_ID",
      references: {
        key: "Platform_ID",
        model: "platform_model"
      }
    },
    Status_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Status_ID",
      references: {
        key: "Status_ID",
        model: "status_model"
      }
    }
  };
  const options = {
    tableName: "ci",
    comment: "",
    indexes: [{
      name: "CLASS_SERVICE_ID",
      unique: false,
      type: "BTREE",
      fields: ["CLASS_SERVICE_ID"]
    }, {
      name: "Platform_ID",
      unique: false,
      type: "BTREE",
      fields: ["Platform_ID"]
    }, {
      name: "Status_ID",
      unique: false,
      type: "BTREE",
      fields: ["Status_ID"]
    }]
  };
  const CiModel = sequelize.define("ci_model", attributes, options);
  return CiModel;
};