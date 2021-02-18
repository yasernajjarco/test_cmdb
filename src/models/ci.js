const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ci_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ci_id"
    },
    logical_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "logical_name"
    },
    company: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "company"
    },
    nrb_managed_by: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "nrb_managed_by"
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "description"
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
    class_service_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "class_service_id",
      references: {
        key: "class_service_id",
        model: "class_service_model"
      }
    },
    platform_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "platform_id",
      references: {
        key: "platform_id",
        model: "platform_model"
      }
    },
    status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "status_id",
      references: {
        key: "status_id",
        model: "status_model"
      }
    }
  };
  const options = {
    tableName: "ci",
    comment: "",
    indexes: [{
      name: "class_service_id",
      unique: false,
      type: "BTREE",
      fields: ["class_service_id"]
    }, {
      name: "platform_id",
      unique: false,
      type: "BTREE",
      fields: ["platform_id"]
    }, {
      name: "status_id",
      unique: false,
      type: "BTREE",
      fields: ["status_id"]
    }]
  };
  const CiModel = sequelize.define("ci_model", attributes, options);
  return CiModel;
};