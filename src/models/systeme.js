const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    systeme_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "systeme_id"
    },
    lpar_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "lpar_id",
      references: {
        key: "lpar_id",
        model: "lpar_model"
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
    },
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "client_id",
      references: {
        key: "client_id",
        model: "client_model"
      }
    }
  };
  const options = {
    tableName: "systeme",
    comment: "",
    indexes: [{
      name: "client_id",
      unique: false,
      type: "BTREE",
      fields: ["client_id"]
    }, {
      name: "lpar_id",
      unique: false,
      type: "BTREE",
      fields: ["lpar_id"]
    }, {
      name: "ci_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_id"]
    }]
  };
  const SystemeModel = sequelize.define("systeme_model", attributes, options);
  return SystemeModel;
};