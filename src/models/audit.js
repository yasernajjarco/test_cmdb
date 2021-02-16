const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Audit_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Audit_ID"
    },
    role: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "role"
    },
    auditTimestamp: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "auditTimestamp"
    },
    auditUser: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "auditUser"
    },
    auditDescription: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "auditDescription"
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
    },
    AuditAction_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "AuditAction_ID",
      references: {
        key: "AuditAction_ID",
        model: "auditaction_model"
      }
    }
  };
  const options = {
    tableName: "audit",
    comment: "",
    indexes: [{
      name: "CI_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_ID"]
    }, {
      name: "AuditAction_ID",
      unique: false,
      type: "BTREE",
      fields: ["AuditAction_ID"]
    }]
  };
  const AuditModel = sequelize.define("audit_model", attributes, options);
  return AuditModel;
};