import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const userRoutes = require("./routes/user")
require("./database/dbConfig")
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const options: cors.CorsOptions = {
  origin: process.env.CLIENT_URL
};

app.use(cors(options));


app.listen(port, () => {
  console.log(`⚡️Server is running at http://localhost:${port}`);
});

//Routes
app.use('/api/user',userRoutes);