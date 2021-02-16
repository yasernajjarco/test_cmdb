const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Pserver_Type_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Pserver_Type_ID"
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
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