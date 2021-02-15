const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    OrderID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "OrderID"
    },
    OrderNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "OrderNumber"
    },
    PersonID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "PersonID",
      references: {
        key: "ID",
        model: "persons"
      }
    }
  };
  const options = {
    tableName: "orders",
    comment: "",
    indexes: [{
      name: "PersonID",
      unique: false,
      type: "BTREE",
      fields: ["PersonID"]
    }]
  };
  const OrdersModel = sequelize.define("orders", attributes, options);
  return OrdersModel;
};