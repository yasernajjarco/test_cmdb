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
    ZLINUX_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "ZLINUX_ID",
      references: {
        key: "ZLINUX_ID",
        model: "zlinux_model"
      }
    }
  };
  const options = {
    tableName: "client_zlinux",
    comment: "",
    indexes: [{
      name: "ZLINUX_ID",
      unique: false,
      type: "BTREE",
      fields: ["ZLINUX_ID"]
    }]
  };
  const ClientZlinuxModel = sequelize.define("client_zlinux_model", attributes, options);
  return ClientZlinuxModel;
};