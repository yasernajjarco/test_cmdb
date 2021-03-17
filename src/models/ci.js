const {
    DataTypes
} = require('sequelize');

module.exports = sequelize => {
    const attributes = {
        ci_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: true,
            comment: null,
            field: "ci_id"
        },
        logical_name: {
            type: DataTypes.STRING(300),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "logical_name"
        },
        our_name: {
            type: DataTypes.STRING(300),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "our_name"
        },
        company: {
            type: DataTypes.STRING(300),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "company"
        },
        nrb_managed_by: {
            type: DataTypes.STRING(300),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "nrb_managed_by"
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "description"
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "name"
        },
        env_type_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "env_type_id",
            references: {
                key: "env_type_id",
                model: "env_type_model"
            }
        },
        ci_subtype_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "ci_subtype_id",
            references: {
                key: "ci_subtype_id",
                model: "ci_subtype_model"
            }
        },
        ci_type_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "ci_type_id",
            references: {
                key: "ci_type_id",
                model: "ci_type_model"
            }
        },
        class_service_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "class_service_id",
            references: {
                key: "class_service_id",
                model: "class_service_model"
            }
        },
        platform_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "platform_id",
            references: {
                key: "platform_id",
                model: "platform_model"
            }
        },
        status_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "status_id",
            references: {
                key: "status_id",
                model: "status_model"
            }
        }
    };
    const options = {
        tableName: "ci",
        comment: "",
        indexes: [{
            name: "ci_subtype_id",
            unique: false,
            type: "BTREE",
            fields: ["ci_subtype_id"]
        }, {
            name: "ci_type_id",
            unique: false,
            type: "BTREE",
            fields: ["ci_type_id"]
        }, {
            name: "class_service_id",
            unique: false,
            type: "BTREE",
            fields: ["class_service_id"]
        }, {
            name: "env_type_id",
            unique: false,
            type: "BTREE",
            fields: ["env_type_id"]
        }, {
            name: "platform_id",
            unique: false,
            type: "BTREE",
            fields: ["platform_id"]
        }, {
            name: "status_id",
            unique: false,
            type: "BTREE",
            fields: ["status_id"]
        }]
    };
    const CiModel = sequelize.define("ci_model", attributes, options);
    return CiModel;
};