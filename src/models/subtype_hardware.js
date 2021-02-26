const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    subtype_hardware_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "subtype_hardware_id"
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
    tableName: "subtype_hardware",
    comment: "",
    indexes: []
  };
  const SubtypeHardwareModel = sequelize.define("subtype_hardware_model", attributes, options);
  return SubtypeHardwareModel;
};