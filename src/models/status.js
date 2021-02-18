const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "status_id"
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
    tableName: "status",
    comment: "",
    indexes: []
  };
  const StatusModel = sequelize.define("status_model", attributes, options);
  return StatusModel;
};