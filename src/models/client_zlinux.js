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
    Zlinux_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "Zlinux_ID",
      references: {
        key: "Zlinux_ID",
        model: "zlinux_model"
      }
    }
  };
  const options = {
    tableName: "client_zlinux",
    comment: "",
    indexes: [{
      name: "Zlinux_ID",
      unique: false,
      type: "BTREE",
      fields: ["Zlinux_ID"]
    }]
  };
  const ClientZlinuxModel = sequelize.define("client_zlinux_model", attributes, options);
  return ClientZlinuxModel;
};