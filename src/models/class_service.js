const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    CLASS_SERVICE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "CLASS_SERVICE_ID"
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
    tableName: "CLASS_SERVICE",
    comment: "",
    indexes: []
  };
  const ClassServiceModel = sequelize.define("class_service_model", attributes, options);
  return ClassServiceModel;
};