module.exports = {

    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,

    /** DATABASE */

    /*     HOST: "localhost",
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
     */

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



    /** AUTH KEY */
    auth: {
        secret: "jllgshllWEUJHGHYJkjsfjds90",
        expiresIn: 8640000
    }
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE3MDA5NzYwLCJleHAiOjE2MjU2NDk3NjB9.eIVCeg2BmCMVO34ySEGBb3i7yuya8dQFHEhCfRwJgYo
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjE3MDA5OTQ4LCJleHAiOjE2MjU2NDk5NDh9.TLFdMlTFW3P8CGsvBH5LmWvcxxW-YvxC6KindnSccGw
//ok