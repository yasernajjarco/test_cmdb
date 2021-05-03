import 'dotenv/config';
const config = require("./config/config");
import cors from 'cors';
import express from 'express';
const initial = require("./initial");
const exportFiles = require("./exportFiles");
const load = require("./loadFiles/index");
import routes from './routes/index.routes';
const logger = require('./logger');

const app = express();
const expressJSDocSwagger = require('express-jsdoc-swagger');

//https://apitransform.com/convert/
//copy from file json
// replace string => json
//text/plain => application/json
// localhost => nrbnrx0020.nrb.be

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

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