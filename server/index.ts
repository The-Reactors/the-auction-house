import express, { Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const userRoutes = require("./routes/user")
require("./database/dbConfig")
dotenv.config();
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
const cookieParser = require("cookie-parser");
import { uuid } from 'uuidv4';
import passport from 'passport';
import typeDefs from './GraphQL/typeDefs';
import resolvers from './GraphQL/resolvers';



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

let secret_key:any = process.env.SESSION_SECRET

app.use(session({
  genid: (req) => uuid(),
  secret: secret_key,
  resave: false,
  saveUninitialized: false,
}));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(passport.initialize());
app.use(passport.session());
require('./passport-config/passport-config')



const startServer = async () => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        user: () => req.user,
        logout: () => req.logout(),
  }),
      
    });

    await server.start();
    server.applyMiddleware({ app , cors:false})
}

startServer();


//Routes
app.use(userRoutes);

app.listen(port, () => {
  console.log(`⚡️Server is running at http://localhost:${port}`);
});



