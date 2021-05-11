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
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// the document to generate database is in src/scriptMysqlCreationDB V3.sql
// set up swagger et generate interface html from file openapi.yml
const swagger_path = path.resolve(__dirname, './openapi.yaml');
const swaggerDocument = YAML.load(swagger_path);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//this command for generate model class from data base (from db to code), you have to remove folder models and launch this command, be ensure that your parameters for connection to DB is okay
// cldb : namedb, roort : username, rootroot: password
// if any champs or modification in database, you have to remove this folder and launch command to generate a new models
// if any relation between tables change, you have to modify the file index.db.js 
//./node_modules/.bin/sequelize-automate -t js -h localhost -d cmdb -u root -p rootroot -o ./src/models


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.json({ message: "Welcome to CMDB API service." });
});

// for initial load and update company 

/* let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
logger.info('start at: ', time)
initial.seed().then(() => {
    load.initialLoad()
}); */


// for extract files from DB
//exportFiles.start();


app.use('/api', routes);


app.listen(config.PORT, () =>
    app.use('/api/v1', app),
    console.log(`le server  listening on port ${config.PORT}!`),
);