const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    hardware_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "hardware_type_id"
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
    tableName: "hardware_type",
    comment: "",
    indexes: []
  };
  const HardwareTypeModel = sequelize.define("hardware_type_model", attributes, options);
  return HardwareTypeModel;
};