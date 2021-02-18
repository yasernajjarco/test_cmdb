const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "client_id",
      references: {
        key: "client_id",
        model: "client_model"
      }
    },
    zlinux_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "zlinux_id",
      references: {
        key: "zlinux_id",
        model: "zlinux_model"
      }
    }
  };
  const options = {
    tableName: "client_zlinux",
    comment: "",
    indexes: [{
      name: "zlinux_id",
      unique: false,
      type: "BTREE",
      fields: ["zlinux_id"]
    }]
  };
  const ClientZlinuxModel = sequelize.define("client_zlinux_model", attributes, options);
  return ClientZlinuxModel;
};