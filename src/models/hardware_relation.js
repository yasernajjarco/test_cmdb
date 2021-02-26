const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    hardware_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "hardware_id",
      references: {
        key: "hardware_id",
        model: "hardware_model"
      }
    },
    hardware_id_1: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "hardware_id_1",
      references: {
        key: "hardware_id",
        model: "hardware_model"
      }
    }
  };
  const options = {
    tableName: "hardware_relation",
    comment: "",
    indexes: [{
      name: "hardware_id_1",
      unique: false,
      type: "BTREE",
      fields: ["hardware_id_1"]
    }]
  };
  const HardwareRelationModel = sequelize.define("hardware_relation_model", attributes, options);
  return HardwareRelationModel;
};