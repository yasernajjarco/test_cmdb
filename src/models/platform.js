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
      autoIncrement: true,
      comment: null,
      field: "Platform_ID"
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    }
  };
  const options = {
    tableName: "Platform",
    comment: "",
    indexes: []
  };
  const PlatformModel = sequelize.define("platform_model", attributes, options);
  return PlatformModel;
};