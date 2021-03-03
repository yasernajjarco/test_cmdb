const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    lpar_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "lpar_id"
    },
    host_ci: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "host_ci"
    },
    host_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "host_type"
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
    tableName: "lpar",
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
  const LparModel = sequelize.define("lpar_model", attributes, options);
  return LparModel;
};