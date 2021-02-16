const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    CONTACT_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "CONTACT_ID"
    },
    LASTNAME: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "LASTNAME"
    },
    FIRSTNAME: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "FIRSTNAME"
    },
    TELEPHONE: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "TELEPHONE"
    },
    EMAIL: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "EMAIL"
    },
    CLIENT_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "CLIENT_ID",
      references: {
        key: "CLIENT_ID",
        model: "client_model"
      }
    }
  };
  const options = {
    tableName: "contact",
    comment: "",
    indexes: [{
      name: "CLIENT_ID",
      unique: false,
      type: "BTREE",
      fields: ["CLIENT_ID"]
    }]
  };
  const ContactModel = sequelize.define("contact_model", attributes, options);
  return ContactModel;
};