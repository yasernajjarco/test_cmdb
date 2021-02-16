const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    CI_Application_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "CI_Application_ID"
    },
    itService: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "itService"
    },
    PRODUCT_CODE: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "PRODUCT_CODE"
    },
    VERSION: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "VERSION"
    },
    IS_VALID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "IS_VALID"
    },
    END_OF_SUPPORT_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "END_OF_SUPPORT_DATE"
    },
    END_EXTENDED_SUPPORT: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "END_EXTENDED_SUPPORT"
    },
    Provider_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Provider_ID",
      references: {
        key: "Provider_ID",
        model: "provider_model"
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
    tableName: "ci_application",
    comment: "",
    indexes: [{
      name: "Provider_ID",
      unique: false,
      type: "BTREE",
      fields: ["Provider_ID"]
    }, {
      name: "CI_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_ID"]
    }]
  };
  const CiApplicationModel = sequelize.define("ci_application_model", attributes, options);
  return CiApplicationModel;
};