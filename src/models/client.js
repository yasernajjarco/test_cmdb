const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    CLIENT_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "CLIENT_ID"
    },
    COMPANYNAME: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "COMPANYNAME"
    },
    ADDRESS: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ADDRESS"
    }
  };
  const options = {
    tableName: "client",
    comment: "",
    indexes: []
  };
  const ClientModel = sequelize.define("client_model", attributes, options);
  return ClientModel;
};