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
      autoIncrement: true,
      comment: null,
      field: "hardware_id"
    },
    serial_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "serial_no"
    },
    env_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "env_type_id",
      references: {
        key: "env_type_id",
        model: "env_type_model"
      }
    },
    ci_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ci_id",
      references: {
        key: "ci_id",
        model: "ci_model"
      }
    }
  };
  const options = {
    tableName: "hardware",
    comment: "",
    indexes: [{
      name: "env_type_id",
      unique: false,
      type: "BTREE",
      fields: ["env_type_id"]
    }, {
      name: "ci_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_id"]
    }]
  };
  const HardwareModel = sequelize.define("hardware_model", attributes, options);
  return HardwareModel;
};