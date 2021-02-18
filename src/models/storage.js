const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    storage_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "storage_id"
    },
    serial_no: {
      type: DataTypes.STRING(150),
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
    storage_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "storage_type_id",
      references: {
        key: "storage_type_id",
        model: "storage_type_model"
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
    tableName: "storage",
    comment: "",
    indexes: [{
      name: "env_type_id",
      unique: false,
      type: "BTREE",
      fields: ["env_type_id"]
    }, {
      name: "storage_type_id",
      unique: false,
      type: "BTREE",
      fields: ["storage_type_id"]
    }, {
      name: "ci_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_id"]
    }]
  };
  const StorageModel = sequelize.define("storage_model", attributes, options);
  return StorageModel;
};