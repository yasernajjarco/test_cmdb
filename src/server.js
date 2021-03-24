import 'dotenv/config';
import cors from 'cors';
import express from 'express';
const initial = require("./initial");
const load = require("./loadFiles/index");
import routes from './routes/index.routes';
const logger = require('./logger');




const app = express();
const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
    info: {
        version: '1.0.0',
        title: 'CMDB API',
        description: 'Service API REST for Mainframe NRB',
        contact: {
            name: 'Yaser ALHAJ KARIM',
            email: 'yaser.alhajkarim@nrb.be',
        },
    },
    security: {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
    filesPattern: './**/*.js',
    swaggerUIPath: '/docs',
    baseDir: __dirname,
    exposeSwaggerUI: true,
    exposeApiDocs: false,
    apiDocsPath: '/v3/docs',
};

expressJSDocSwagger(app)(options);



//./node_modules/.bin/sequelize-automate -t js -h localhost -d cmdb -u root -p rootroot -o ./src/models
// taskkill /f /im node.exe

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.json({ message: "Welcome to CMDB API service." });
});

/* var options = {
    swaggerOptions: {
        authAction: { JWT: { name: "JWT", schema: { type: "apiKey", in: "header", name: "Authorization", description: "" }, value: "Bearer <JWT>" } }
    }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
 */

let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
logger.info('start at: ', time)

initial.seed().then(() => {
    load.test()
});



app.use('/api', routes);


app.listen(process.env.PORT, () =>
    app.use('/api/v1', app),
    console.log(`le server  listening on port ${process.env.PORT}!`),
);