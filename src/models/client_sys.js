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
    systeme_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
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
    tableName: "client_sys",
    comment: "",
    indexes: [{
      name: "systeme_id",
      unique: false,
      type: "BTREE",
      fields: ["systeme_id"]
    }]
  };
  const ClientSysModel = sequelize.define("client_sys_model", attributes, options);
  return ClientSysModel;
};