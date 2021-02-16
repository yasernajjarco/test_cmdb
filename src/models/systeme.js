const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Systeme_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Systeme_ID"
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
    LPAR_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "LPAR_ID",
      references: {
        key: "LPAR_ID",
        model: "lpar_model"
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
    tableName: "systeme",
    comment: "",
    indexes: [{
      name: "ENV_TYPE_ID",
      unique: false,
      type: "BTREE",
      fields: ["ENV_TYPE_ID"]
    }, {
      name: "LPAR_ID",
      unique: false,
      type: "BTREE",
      fields: ["LPAR_ID"]
    }, {
      name: "CI_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_ID"]
    }]
  };
  const SystemeModel = sequelize.define("systeme_model", attributes, options);
  return SystemeModel;
};