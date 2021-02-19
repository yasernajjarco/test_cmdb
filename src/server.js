import 'dotenv/config';
import cors from 'cors';
import express from 'express';
const initial = require("./initial");
import routes from './routes/index.routes';

const app = express();

//./node_modules/.bin/sequelize-automate -t js -h localhost -d cmdb -u root -p rootroot -o ./src/models
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to CMDB API service." });
});

initial.seed();



app.use('/platforms', routes.platform);
app.use('/users', routes.Auth);
app.use('/cis', routes.Ci);


app.use('/', routes.User);



app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);


