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
    lpar_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "lpar_id",
      references: {
        key: "lpar_id",
        model: "lpar_model"
      }
    }
  };
  const options = {
    tableName: "hardware_lpar",
    comment: "",
    indexes: [{
      name: "lpar_id",
      unique: false,
      type: "BTREE",
      fields: ["lpar_id"]
    }]
  };
  const HardwareLparModel = sequelize.define("hardware_lpar_model", attributes, options);
  return HardwareLparModel;
};