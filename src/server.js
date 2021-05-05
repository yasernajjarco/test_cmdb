import 'dotenv/config';
const config = require("./config/config");
import cors from 'cors';
import express from 'express';
const initial = require("./initial");
const exportFiles = require("./exportFiles");
const load = require("./loadFiles/index");
import routes from './routes/index.routes';
const logger = require('./logger');
import YAML from 'yamljs';
const app = express();
const expressJSDocSwagger = require('express-jsdoc-swagger');
const swaggerUi = require('swagger-ui-express');
const path = require('path');



const swagger_path = path.resolve(__dirname, './openapi.yaml');
const swaggerDocument = YAML.load(swagger_path);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



//./node_modules/.bin/sequelize-automate -t js -h localhost -d cmdb -u root -p rootroot -o ./src/models
// taskkill /f /im node.exe

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.json({ message: "Welcome to CMDB API service." });
});


/* 
let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
logger.info('start at: ', time)
initial.seed().then(() => {
    load.initialLoad()
}); */


//exportFiles.start();


app.use('/api', routes);


app.listen(config.PORT, () =>
    app.use('/api/v1', app),
    console.log(`le server  listening on port ${config.PORT}!`),
);


/***
 *  HOW TO SET SWAGGER
 */
//https://apitransform.com/convert/
//copy from file json
// replace "type":"string", =>  '' 
//text/plain => application/json
//https://editor.swagger.io/ 
// to yaml


/*
openapi: 3.0.0
servers:
  - url: 'http://localhost:3000'
    description: 'Local development server'
  - url: 'http://nrbnrx0020.nrb.be:3000'
    description: 'Development server'
  - url: 'http://nrbnrx0020.nrb.be:3001'
    description: 'Test server'
  - url: 'http://nrbnrx0020.nrb.be:3002'
    description: 'Production server'
info:
  description: "This REST API allows you to view / modify / delete / add all the CI elements of the Mainframe team"
  version: "1.0.0"
  title: "CMDB Mainframe"
  termsOfService: "https://www.nrb.be/"
  contact:
    email: "yaser.alhajkarim@nrb.be"
    name: "Yaser ALHAJ KARIM"
*/

// paths...