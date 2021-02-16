const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Status_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Status_ID"
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
    tableName: "Status",
    comment: "",
    indexes: []
  };
  const StatusModel = sequelize.define("status_model", attributes, options);
  return StatusModel;
};