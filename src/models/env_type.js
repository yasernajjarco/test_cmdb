const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ENV_TYPE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ENV_TYPE_ID"
    },
    NAME: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "NAME"
    }
  };
  const options = {
    tableName: "env_type",
    comment: "",
    indexes: []
  };
  const EnvTypeModel = sequelize.define("env_type_model", attributes, options);
  return EnvTypeModel;
};