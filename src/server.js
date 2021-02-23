import 'dotenv/config';
import cors from 'cors';
import express from 'express';
const initial = require("./initial");
const load = require("./loadFiles/index");

import routes from './routes/index.routes';
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');


const app = express();

//./node_modules/.bin/sequelize-automate -t js -h localhost -d cmdb -u root -p rootroot -o ./src/models
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));







app.get("/", (req, res) => {
  res.json({ message: "Welcome to CMDB API service." });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initial.seed();
load.test();


app.use('/api', routes);




app.listen(process.env.PORT, () => 
  app.use('/api/v1', app),
  console.log(`Example app listening on port ${process.env.PORT}!`),
);


