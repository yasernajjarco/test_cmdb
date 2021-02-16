const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    AUDIT_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "AUDIT_ID"
    },
    ROLE: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ROLE"
    },
    AUDITTIMESTAMP: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "AUDITTIMESTAMP"
    },
    AUDITUSER: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "AUDITUSER"
    },
    AUDITDESCRIPTION: {
      type: DataTypes.STRING(1500),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "AUDITDESCRIPTION"
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
    AUDITACTION_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "AUDITACTION_ID",
      references: {
        key: "AUDITACTION_ID",
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
      name: "AUDITACTION_ID",
      unique: false,
      type: "BTREE",
      fields: ["AUDITACTION_ID"]
    }]
  };
  const AuditModel = sequelize.define("audit_model", attributes, options);
  return AuditModel;
};