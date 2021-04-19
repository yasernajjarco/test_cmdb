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
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "client_id",
      references: {
        key: "client_id",
        model: "client_model"
      }
    }
  };
  const options = {
    tableName: "client_platform",
    comment: "",
    indexes: [{
      name: "client_id",
      unique: false,
      type: "BTREE",
      fields: ["client_id"]
    }]
  };
  const ClientPlatformModel = sequelize.define("client_platform_model", attributes, options);
  return ClientPlatformModel;
};