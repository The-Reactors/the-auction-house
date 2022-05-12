import { Request, Response} from 'express';
import passport from 'passport';
const express = require('express')
const router = new express.Router()
const pool = require("../database/dbConfig")



router.post('/createTable',async(req: Request, mainRes: Response) => {


    pool.query('CREATE TABLE auction_users (user_id VARCHAR(255) PRIMARY KEY,name VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) NOT NULL, profilePicLink VARCHAR ( 255 ) NOT NULL, googleId VARCHAR ( 255 ) NOT NULL);', (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        mainRes.status(200).send("Table Created!")
        console.log(res.rows);
      }
    })
    
  });

  router.post('/insertIntoTable',async(req: Request, res: Response) => {

    
    const query = {
      text: 'INSERT INTO auction_users (user_id,name,email,profilePicLink,googleId) VALUES($1,$2,$3,$4,$5)',
      values:[req.body.user_id, req.body.name,req.body.email, req.body.profilePicLink,req.body.googleId],
    }

    pool.query(query, (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
        return console.error(err.stack);
      }
      else
      {
        console.log(res.rows);
       
      }
    })
    res.status(200).send("Values Inserted Succesfully !");

  });

  router.post('/viewTable', async(req: Request, mainRes: Response) => {

    pool.query('SELECT * FROM auction_users', (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        console.log(res.rows);
        mainRes.status(200).send(res.rows)
      }
    })
    
  });

  router.get('/viewMe', async(req: Request, mainRes: Response) => {

   mainRes.send(req.user);
    
  });

  router.post('/searchUser', async(req: Request, mainRes: Response) => {
    const query = {
      text: 'SELECT * FROM auction_users WHERE email = $1',
      values:[req.body.email],
    }

    pool.query(query, (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        console.log(res.rows);
        mainRes.status(200).send(res.rows)
      }
    })
    
  });

  router.get("/auth/google",
    passport.authenticate("google", {scope:["profile","email" ] })
);

router.get('/auth/login/callback', passport.authenticate('google', {
  successRedirect: 'http://localhost:5000/graphql',
  failureRedirect: 'http://localhost:5000/graphql',
}));

  module.exports = router