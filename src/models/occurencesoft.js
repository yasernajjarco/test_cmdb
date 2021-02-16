const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    OCCURENCESOFT_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "OCCURENCESOFT_ID"
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
    CLIENT_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CLIENT_ID",
      references: {
        key: "CLIENT_ID",
        model: "client_model"
      }
    },
    INSTANCE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "INSTANCE_ID",
      references: {
        key: "INSTANCE_ID",
        model: "instance_model"
      }
    }
  };
  const options = {
    tableName: "occurencesoft",
    comment: "",
    indexes: [{
      name: "CLIENT_ID",
      unique: false,
      type: "BTREE",
      fields: ["CLIENT_ID"]
    }, {
      name: "INSTANCE_ID",
      unique: false,
      type: "BTREE",
      fields: ["INSTANCE_ID"]
    }]
  };
  const OccurencesoftModel = sequelize.define("occurencesoft_model", attributes, options);
  return OccurencesoftModel;
};