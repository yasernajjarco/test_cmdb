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
    instance_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "instance_id",
      references: {
        key: "instance_id",
        model: "instance_model"
      }
    }
  };
  const options = {
    tableName: "instance_client",
    comment: "",
    indexes: [{
      name: "instance_id",
      unique: false,
      type: "BTREE",
      fields: ["instance_id"]
    }]
  };
  const InstanceClientModel = sequelize.define("instance_client_model", attributes, options);
  return InstanceClientModel;
};