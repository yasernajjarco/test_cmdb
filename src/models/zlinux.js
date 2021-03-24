const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    zlinux_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "zlinux_id"
    },
    domaine: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "domaine"
    },
    os_version: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "os_version"
    },
    cpu_type: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cpu_type"
    },
    cpu_number: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cpu_number"
    },
    physical_mem_total: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "physical_mem_total"
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
    systeme_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "systeme_id",
      references: {
        key: "systeme_id",
        model: "systeme_model"
      }
    }
  };
  const options = {
    tableName: "zlinux",
    comment: "",
    indexes: [{
      name: "ci_id",
      unique: false,
      type: "BTREE",
      fields: ["ci_id"]
    }, {
      name: "systeme_id",
      unique: false,
      type: "BTREE",
      fields: ["systeme_id"]
    }]
  };
  const ZlinuxModel = sequelize.define("zlinux_model", attributes, options);
  return ZlinuxModel;
};