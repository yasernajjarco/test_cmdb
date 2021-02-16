const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    PSERVER_TYPE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "PSERVER_TYPE_ID"
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
    tableName: "pserver_type",
    comment: "",
    indexes: []
  };
  const PserverTypeModel = sequelize.define("pserver_type_model", attributes, options);
  return PserverTypeModel;
};