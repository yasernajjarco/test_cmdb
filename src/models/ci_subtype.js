const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ci_subtype_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ci_subtype_id"
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
    tableName: "ci_subtype",
    comment: "",
    indexes: []
  };
  const CiSubtypeModel = sequelize.define("ci_subtype_model", attributes, options);
  return CiSubtypeModel;
};