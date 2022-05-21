import { Request, Response} from 'express';
import passport from 'passport';
const express = require('express')
const router = new express.Router()
const pool = require("../database/dbConfig")
import { uuid } from "uuidv4";
const multer = require('multer')



const productImage = multer({
  limits:{
      fileSize:3000000
  },
  fileFilter(req,file,cb){
      if(!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
          return cb(new Error('This is not a correct format of the file'))

      cb(undefined,true)
  }
})



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


  router.post('/createProductTable',async(req: Request, mainRes: Response) => {


    pool.query('CREATE TABLE auction_products (p_id VARCHAR(255) PRIMARY KEY,name VARCHAR ( 50 ) NOT NULL, pDesc VARCHAR ( 255 ) NOT NULL, pImgs bytea[], sellerId VARCHAR ( 255 ) NOT NULL);', (err:Error, res:any) => {
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

  router.post('/createBidTable',async(req: Request, mainRes: Response) => {


    pool.query('CREATE TABLE auction_bids (p_id VARCHAR(255) ,buyerId VARCHAR ( 50 ) NOT NULL, amount VARCHAR ( 255 ) NOT NULL, FOREIGN KEY (p_id) REFERENCES auction_products(p_id), PRIMARY KEY (p_id, buyerId));', (err:Error, res:any) => {
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


  router.post('/insertIntoProductTable',productImage.array('productImage',3),async(req: Request, res: Response) => {

    const imagesArray : Buffer[] = []

    if(req.files === undefined){

      const query = {
        text: 'INSERT INTO auction_products (p_id,name,pDesc,sellerId) VALUES($1,$2,$3,$4)',
        values:[uuid(), req.body.name,req.body.pDesc,req.body.sellerId],
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
    }else{
      const files= req.files as Express.Multer.File[];
      files.forEach(element => imagesArray.push(element.buffer))
      


      const query = {
        text: 'INSERT INTO auction_products (p_id,name,pDesc,pImgs,sellerId) VALUES($1,$2,$3,$4,$5)',
        values:[uuid(), req.body.name,req.body.pDesc,imagesArray, req.body.sellerId],
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

      

    }
    
    

    

  });


  
  router.post('/insertIntoProductTable',async(req: Request, res: Response) => {

    
    const query = {
      text: 'INSERT INTO auction_products (p_id,name,desc,profilePicLink,googleId) VALUES($1,$2,$3,$4,$5)',
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