const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Storage_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Storage_ID"
    },
    SERIAL_NO: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "SERIAL_NO"
    },
    ENV_TYPE_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ENV_TYPE_ID",
      references: {
        key: "ENV_TYPE_ID",
        model: "env_type_model"
      }
    },
    Storage_Type_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Storage_Type_ID",
      references: {
        key: "Storage_Type_ID",
        model: "storage_type_model"
      }
    },
    CI_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CI_ID",
      references: {
        key: "CI_ID",
        model: "ci_model"
      }
    }
  };
  const options = {
    tableName: "storage",
    comment: "",
    indexes: [{
      name: "ENV_TYPE_ID",
      unique: false,
      type: "BTREE",
      fields: ["ENV_TYPE_ID"]
    }, {
      name: "Storage_Type_ID",
      unique: false,
      type: "BTREE",
      fields: ["Storage_Type_ID"]
    }, {
      name: "CI_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_ID"]
    }]
  };
  const StorageModel = sequelize.define("storage_model", attributes, options);
  return StorageModel;
};