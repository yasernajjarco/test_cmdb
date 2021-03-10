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
    occurencesoft_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "occurencesoft_id",
      references: {
        key: "occurencesoft_id",
        model: "occurencesoft_model"
      }
    }
  };
  const options = {
    tableName: "occurence_client",
    comment: "",
    indexes: [{
      name: "occurencesoft_id",
      unique: false,
      type: "BTREE",
      fields: ["occurencesoft_id"]
    }]
  };
  const OccurenceClientModel = sequelize.define("occurence_client_model", attributes, options);
  return OccurenceClientModel;
};