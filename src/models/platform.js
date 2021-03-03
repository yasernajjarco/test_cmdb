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
      autoIncrement: true,
      comment: null,
      field: "platform_id"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    }
  };
  const options = {
    tableName: "platform",
    comment: "",
    indexes: []
  };
  const PlatformModel = sequelize.define("platform_model", attributes, options);
  return PlatformModel;
};