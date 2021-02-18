const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    platform_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "platform_id",
      references: {
        key: "platform_id",
        model: "platform_model"
      }
    },
    provider_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "provider_id",
      references: {
        key: "provider_id",
        model: "provider_model"
      }
    }
  };
  const options = {
    tableName: "provider_platform",
    comment: "",
    indexes: [{
      name: "provider_id",
      unique: false,
      type: "BTREE",
      fields: ["provider_id"]
    }]
  };
  const ProviderPlatformModel = sequelize.define("provider_platform_model", attributes, options);
  return ProviderPlatformModel;
};