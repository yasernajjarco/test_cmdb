const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    PLATFORM_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "PLATFORM_ID",
      references: {
        key: "PLATFORM_ID",
        model: "platform_model"
      }
    },
    PROVIDER_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "PROVIDER_ID",
      references: {
        key: "PROVIDER_ID",
        model: "provider_model"
      }
    }
  };
  const options = {
    tableName: "provider_platform",
    comment: "",
    indexes: [{
      name: "PROVIDER_ID",
      unique: false,
      type: "BTREE",
      fields: ["PROVIDER_ID"]
    }]
  };
  const ProviderPlatformModel = sequelize.define("provider_platform_model", attributes, options);
  return ProviderPlatformModel;
};