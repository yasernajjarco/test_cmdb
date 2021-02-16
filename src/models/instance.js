const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Instance_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Instance_ID"
    },
    IsOccurenciable: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "IsOccurenciable"
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
    Systeme_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Systeme_ID",
      references: {
        key: "Systeme_ID",
        model: "systeme_model"
      }
    },
    CI_Application_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CI_Application_ID",
      references: {
        key: "CI_Application_ID",
        model: "ci_application_model"
      }
    }
  };
  const options = {
    tableName: "instance",
    comment: "",
    indexes: [{
      name: "Systeme_ID",
      unique: false,
      type: "BTREE",
      fields: ["Systeme_ID"]
    }, {
      name: "CI_Application_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_Application_ID"]
    }]
  };
  const InstanceModel = sequelize.define("instance_model", attributes, options);
  return InstanceModel;
};