const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    partition_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "partition_type_id"
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
    tableName: "partition_type",
    comment: "",
    indexes: []
  };
  const PartitionTypeModel = sequelize.define("partition_type_model", attributes, options);
  return PartitionTypeModel;
};