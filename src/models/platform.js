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
      autoIncrement: true,
      comment: null,
      field: "PLATFORM_ID"
    },
    NAME: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "NAME"
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