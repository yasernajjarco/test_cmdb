module.exports = {
 
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  /** DATABASE */

    HOST: "localhost",
    USER: "root",
    PASSWORD: "rootroot",
    DB: "cmdb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  
  

  /** AUTH KEY */
  auth: {
    secret: "our-secret-key"
  }
};


//ok 

