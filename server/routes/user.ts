import { Request, Response} from 'express';
const express = require('express')
const router = new express.Router()
const pool = require("../database/dbConfig")



router.post('/createTable',async(req: Request, res: Response) => {


    pool.query('CREATE TABLE auction_users (user_id serial PRIMARY KEY,username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) UNIQUE NOT NULL,created_on TIMESTAMP NOT NULL);', (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        res.status(200).send("Table Created!")
        console.log(res.rows);
      }
    })
    
  });

  router.post('/insertIntoTable',async(req: Request, res: Response) => {

    
    const query = {
      text: 'INSERT INTO auction_users (user_id,username,password,email,created_on) VALUES($1,$2,$3,$4,$5)',
      values:[req.body.user_id, req.body.username, req.body.password, req.body.email,req.body.timestamp],
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

  module.exports = router