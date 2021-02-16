const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    CLIENT_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "CLIENT_ID",
      references: {
        key: "CLIENT_ID",
        model: "client_model"
      }
    },
    SYSTEME_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "SYSTEME_ID",
      references: {
        key: "SYSTEME_ID",
        model: "systeme_model"
      }
    }
  };
  const options = {
    tableName: "client_sys",
    comment: "",
    indexes: [{
      name: "SYSTEME_ID",
      unique: false,
      type: "BTREE",
      fields: ["SYSTEME_ID"]
    }]
  };
  const ClientSysModel = sequelize.define("client_sys_model", attributes, options);
  return ClientSysModel;
};