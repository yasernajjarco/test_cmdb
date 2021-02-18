const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    storage_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "storage_type_id"
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
    tableName: "storage_type",
    comment: "",
    indexes: []
  };
  const StorageTypeModel = sequelize.define("storage_type_model", attributes, options);
  return StorageTypeModel;
};