const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    audit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "audit_id"
    },
    role: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "role"
    },
    audittimestamp: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "audittimestamp"
    },
    audituser: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "audituser"
    },
    auditdescription: {
      type: DataTypes.STRING(3000),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "auditdescription"
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
    tableName: "audit",
    comment: "",
    indexes: [{
      name: "ci_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_id"]
    }]
  };
  const AuditModel = sequelize.define("audit_model", attributes, options);
  return AuditModel;
};