const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    occurencesoft_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "occurencesoft_id"
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
    },
    our_name: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "our_name"
    },
    instance_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "instance_id",
      references: {
        key: "instance_id",
        model: "instance_model"
      }
    }
  };
  const options = {
    tableName: "occurencesoft",
    comment: "",
    indexes: [{
      name: "ci_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_id"]
    }, {
      name: "instance_id",
      unique: false,
      type: "BTREE",
      fields: ["instance_id"]
    }]
  };
  const OccurencesoftModel = sequelize.define("occurencesoft_model", attributes, options);
  return OccurencesoftModel;
};