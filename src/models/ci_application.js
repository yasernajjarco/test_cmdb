const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ci_application_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ci_application_id"
    },
    itservice: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "itservice"
    },
    product_code: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "product_code"
    },
    version: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "version"
    },
    is_valid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "is_valid"
    },
    end_of_support_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "end_of_support_date"
    },
    end_extended_support: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "end_extended_support"
    },
    provider_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "provider_id",
      references: {
        key: "provider_id",
        model: "provider_model"
      }
    },
    ci_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ci_id",
      references: {
        key: "ci_id",
        model: "ci_model"
      }
    }
  };
  const options = {
    tableName: "ci_application",
    comment: "",
    indexes: [{
      name: "provider_id",
      unique: false,
      type: "BTREE",
      fields: ["provider_id"]
    }, {
      name: "ci_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_id"]
    }]
  };
  const CiApplicationModel = sequelize.define("ci_application_model", attributes, options);
  return CiApplicationModel;
};