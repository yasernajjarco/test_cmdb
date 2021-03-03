const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    auditaction_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "auditaction_id"
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    }
  };
  const options = {
    tableName: "auditaction",
    comment: "",
    indexes: []
  };
  const AuditactionModel = sequelize.define("auditaction_model", attributes, options);
  return AuditactionModel;
};