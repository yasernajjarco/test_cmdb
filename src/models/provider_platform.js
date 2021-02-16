const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Platform_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "Platform_ID",
      references: {
        key: "Platform_ID",
        model: "platform_model"
      }
    },
    Provider_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "Provider_ID",
      references: {
        key: "Provider_ID",
        model: "provider_model"
      }
    }
  };
  const options = {
    tableName: "provider_platform",
    comment: "",
    indexes: [{
      name: "Provider_ID",
      unique: false,
      type: "BTREE",
      fields: ["Provider_ID"]
    }]
  };
  const ProviderPlatformModel = sequelize.define("provider_platform_model", attributes, options);
  return ProviderPlatformModel;
};