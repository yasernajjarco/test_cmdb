const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    AUDITACTION_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "AUDITACTION_ID"
    },
    NAME: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "NAME"
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