//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE3MDA5NzYwLCJleHAiOjE2MjU2NDk3NjB9.eIVCeg2BmCMVO34ySEGBb3i7yuya8dQFHEhCfRwJgYo
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjE3MDA5OTQ4LCJleHAiOjE2MjU2NDk5NDh9.TLFdMlTFW3P8CGsvBH5LmWvcxxW-YvxC6KindnSccGw

let path = require('path');
let filename = require('path').resolve(__dirname, '../../..');
let env = path.dirname(filename).split(path.sep).pop();

console.log(env);

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

function config() {
    switch (env) {
        case 'local':
            return local;
        case 'dev':
            return dev;
        case 'test':
            return test;
        case 'prod':
            return prod;
    }
}



module.exports = config();