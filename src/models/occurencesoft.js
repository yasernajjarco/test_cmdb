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
    our_name: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "our_name"
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "client_id",
      references: {
        key: "client_id",
        model: "client_model"
      }
    },
    instance_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
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
      name: "client_id",
      unique: false,
      type: "BTREE",
      fields: ["client_id"]
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