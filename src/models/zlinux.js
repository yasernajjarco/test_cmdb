const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Zlinux_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Zlinux_ID"
    },
    DOMAINE: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "DOMAINE"
    },
    OS_VERSION: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "OS_VERSION"
    },
    CPU_TYPE: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CPU_TYPE"
    },
    CPU_NUMBER: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CPU_NUMBER"
    },
    PHYSICAL_MEM_TOTAL: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "PHYSICAL_MEM_TOTAL"
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
    Systeme_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Systeme_ID",
      references: {
        key: "Systeme_ID",
        model: "systeme_model"
      }
    }
  };
  const options = {
    tableName: "zlinux",
    comment: "",
    indexes: [{
      name: "CI_ID",
      unique: false,
      type: "BTREE",
      fields: ["CI_ID"]
    }, {
      name: "Systeme_ID",
      unique: false,
      type: "BTREE",
      fields: ["Systeme_ID"]
    }]
  };
  const ZlinuxModel = sequelize.define("zlinux_model", attributes, options);
  return ZlinuxModel;
};