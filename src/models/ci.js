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
    NAME: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "NAME"
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
    PLATFORM_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "PLATFORM_ID",
      references: {
        key: "PLATFORM_ID",
        model: "platform_model"
      }
    },
    STATUS_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "STATUS_ID",
      references: {
        key: "STATUS_ID",
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
      name: "PLATFORM_ID",
      unique: false,
      type: "BTREE",
      fields: ["PLATFORM_ID"]
    }, {
      name: "STATUS_ID",
      unique: false,
      type: "BTREE",
      fields: ["STATUS_ID"]
    }]
  };
  const CiModel = sequelize.define("ci_model", attributes, options);
  return CiModel;
};