let path = require('path');
let filename = require('path').resolve(__dirname, '../../..');
let env = path.dirname(filename).split(path.sep).pop();

const local = {
    PORT: 3000,
    ENV: 'local',
    HOST: "localhost",
    USER: "root",
    PASSWORD: "rootroot",
    DB: "cmdb",
    dialect: "mariadb",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        typeCast: function(field, next) {
            if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
                return new Date(field.string() + 'Z');
            }
            return next();
        }
    },

    auth: {
        secret: "jllgshllWEUJHGHYJkjsfjds90",
        expiresIn: 8640000
    }
};

const dev = {

    PORT: 3000,
    ENV: 'dev',
    HOST: "localhost",
    USER: "lsyalh",
    PASSWORD: "lsyalh",
    DB: "dbCMDBdev",
    dialect: "mariadb",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },


    auth: {
        secret: "jllgshllWEUJHGHYJkjsfjds90",
        expiresIn: 8640000
    }
};

const test = {

    PORT: 3001,
    ENV: 'test',

    HOST: "localhost",
    USER: "lsyalh",
    PASSWORD: "lsyalh",
    DB: "dbCMDBtest",
    dialect: "mariadb",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },


    auth: {
        secret: "jllgshllWEUJHGHYJkjsfjds90",
        expiresIn: 8640000
    }
};

const prod = {

    PORT: 3002,
    ENV: 'prod',

    HOST: "localhost",
    USER: "lsyalh",
    PASSWORD: "lsyalh",
    DB: "dbCMDBprod",
    dialect: "mariadb",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },


    auth: {
        secret: "jllgshllWEUJHGHYJkjsfjds90",
        expiresIn: 8640000
    }
};

/**
 * read the folder of application and decide witch config to set
 * this folders have to be like:
 * /local\Backend\test_cmdb or dev\Backend\test_cmdb or test\Backend\test_cmdb or prod\Backend\test_cmdb
 * @returns config application
 */
function config() {
    switch (env) {

        case 'dev':
            return dev;
        case 'test':
            return test;
        case 'prod':
            return prod;
        default:
            return local;
    }
}



module.exports = config();