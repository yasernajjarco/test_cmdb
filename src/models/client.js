const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "client_id"
    },
    companyname: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "companyname"
    },
    address: {
      type: DataTypes.STRING(300),
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