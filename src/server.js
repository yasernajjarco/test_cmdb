import 'dotenv/config';
import cors from 'cors';
import express from 'express';
const initial = require("./initial");


import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  };
  next();
}); */

initial.seed();



app.use('/platforms', routes.platform);


app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);


