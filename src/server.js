import 'dotenv/config';
import cors from 'cors';
import express from 'express';
const initial = require("./initial");


import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to CMDB API service." });
});

initial.seed();



app.use('/platforms', routes.platform);


app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);


