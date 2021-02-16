const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Provider_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Provider_ID"
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "address"
    },
    VENDOR_CODE: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "VENDOR_CODE"
    },
    VENDOR: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "VENDOR"
    }
  };
  const options = {
    tableName: "provider",
    comment: "",
    indexes: []
  };
  const ProviderModel = sequelize.define("provider_model", attributes, options);
  return ProviderModel;
};