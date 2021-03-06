const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    class_service_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "class_service_id"
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    }
  };
  const options = {
    tableName: "class_service",
    comment: "",
    indexes: []
  };
  const ClassServiceModel = sequelize.define("class_service_model", attributes, options);
  return ClassServiceModel;
};