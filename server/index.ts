import express, { Express} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const userRoutes = require("./routes/user")
require("./database/dbConfig")
dotenv.config();
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import { uuid } from 'uuidv4';
import passport from 'passport';
import typeDefs from './typeDefs';
import resolvers from './resolvers';


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

passport.serializeUser((obj:any, done:any) => {
  console.log("Serilializing User");
  console.log(obj);
  done(null, obj);
});

// * Passport deserializeUser
passport.deserializeUser(async (obj:any, done:any) => {
  console.log("Deserializing User");
  done(null, obj);
});



let secret_key:any = process.env.SESSION_SECRET

app.use(session({
  genid: (req) => uuid(),
  secret: secret_key,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/user',userRoutes);

const startServer = async () => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        getUser: () => req.user,
        logout: () => req.logout(),
      }),
    });

    await server.start();
    server.applyMiddleware({ app })
}

startServer();



app.listen(port, () => {
  console.log(`⚡️Server is running at http://localhost:${port}`);
});



