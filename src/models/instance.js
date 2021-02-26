const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    instance_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "instance_id"
    },
    isoccurenciable: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "isoccurenciable"
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    },
    systeme_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "systeme_id",
      references: {
        key: "systeme_id",
        model: "systeme_model"
      }
    },
    ci_application_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ci_application_id",
      references: {
        key: "ci_application_id",
        model: "ci_application_model"
      }
    }
  };
  const options = {
    tableName: "instance",
    comment: "",
    indexes: [{
      name: "systeme_id",
      unique: false,
      type: "BTREE",
      fields: ["systeme_id"]
    }, {
      name: "ci_application_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_application_id"]
    }]
  };
  const InstanceModel = sequelize.define("instance_model", attributes, options);
  return InstanceModel;
};