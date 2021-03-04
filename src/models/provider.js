const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    provider_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "provider_id"
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
    vendor_code: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "vendor_code"
    },
    vendor: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "vendor"
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