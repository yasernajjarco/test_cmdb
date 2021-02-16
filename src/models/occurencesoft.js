const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    OccurenceSoft_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "OccurenceSoft_ID"
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
    Client_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Client_ID",
      references: {
        key: "Client_ID",
        model: "client_model"
      }
    },
    Instance_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Instance_ID",
      references: {
        key: "Instance_ID",
        model: "instance_model"
      }
    }
  };
  const options = {
    tableName: "occurencesoft",
    comment: "",
    indexes: [{
      name: "Client_ID",
      unique: false,
      type: "BTREE",
      fields: ["Client_ID"]
    }, {
      name: "Instance_ID",
      unique: false,
      type: "BTREE",
      fields: ["Instance_ID"]
    }]
  };
  const OccurencesoftModel = sequelize.define("occurencesoft_model", attributes, options);
  return OccurencesoftModel;
};