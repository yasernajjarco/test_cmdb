const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Client_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "Client_ID",
      references: {
        key: "Client_ID",
        model: "client_model"
      }
    },
    Systeme_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
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
    tableName: "client_sys",
    comment: "",
    indexes: [{
      name: "Systeme_ID",
      unique: false,
      type: "BTREE",
      fields: ["Systeme_ID"]
    }]
  };
  const ClientSysModel = sequelize.define("client_sys_model", attributes, options);
  return ClientSysModel;
};