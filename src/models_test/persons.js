const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ID"
    },
    LastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "LastName"
    },
    FirstName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "FirstName"
    },
    Age: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Age"
    }
  };
  const options = {
    tableName: "persons",
    comment: "",
    indexes: []
  };
  const PersonsModel = sequelize.define("persons", attributes, options);
  return PersonsModel;
};