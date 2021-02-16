const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    INSTANCE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "INSTANCE_ID"
    },
    ISOCCURENCIABLE: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ISOCCURENCIABLE"
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
    SYSTEME_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "SYSTEME_ID",
      references: {
        key: "SYSTEME_ID",
        model: "systeme_model"
      }
    },
    CI_APPLICATION_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CI_APPLICATION_ID",
      references: {
        key: "CI_APPLICATION_ID",
        model: "ci_application_model"
      }
    }
  };
  const options = {
    tableName: "instance",
    comment: "",
    indexes: [{
      name: "SYSTEME_ID",
      unique: false,
      type: "BTREE",
      fields: ["SYSTEME_ID"]
    }, {
      name: "CI_APPLICATION_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_APPLICATION_ID"]
    }]
  };
  const InstanceModel = sequelize.define("instance_model", attributes, options);
  return InstanceModel;
};