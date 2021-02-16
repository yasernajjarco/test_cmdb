const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    Contact_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "Contact_ID"
    },
    lastname: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "lastname"
    },
    firstname: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "firstname"
    },
    telephone: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "telephone"
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "email"
    },
    Client_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Client_ID",
      references: {
        key: "Client_ID",
        model: "client_model"
      }
    }
  };
  const options = {
    tableName: "contact",
    comment: "",
    indexes: [{
      name: "Client_ID",
      unique: false,
      type: "BTREE",
      fields: ["Client_ID"]
    }]
  };
  const ContactModel = sequelize.define("contact_model", attributes, options);
  return ContactModel;
};