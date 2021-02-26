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
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "client_id",
      references: {
        key: "client_id",
        model: "client_model"
      }
    }
  };
  const options = {
    tableName: "client_hardware",
    comment: "",
    indexes: [{
      name: "client_id",
      unique: false,
      type: "BTREE",
      fields: ["client_id"]
    }]
  };
  const ClientHardwareModel = sequelize.define("client_hardware_model", attributes, options);
  return ClientHardwareModel;
};