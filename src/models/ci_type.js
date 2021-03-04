const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ci_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ci_type_id"
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
    tableName: "ci_type",
    comment: "",
    indexes: []
  };
  const CiTypeModel = sequelize.define("ci_type_model", attributes, options);
  return CiTypeModel;
};