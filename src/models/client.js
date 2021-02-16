const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Client_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Client_ID"
    },
    companyName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "companyName"
    },
    address: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "address"
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