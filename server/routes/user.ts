import { Request, Response} from 'express';
import passport from 'passport';
const express = require('express')
const router = new express.Router()
const pool = require("../database/dbConfig")
import { uuid } from "uuidv4";
const multer = require('multer')
const auth = require('../middleware/auth')

var pg = require('pg');
var types = pg.types;
types.setTypeParser(1114, function(stringValue) {
return stringValue;
});

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


    pool.query('CREATE TABLE auction_products (p_id VARCHAR(255) PRIMARY KEY,name VARCHAR ( 50 ) NOT NULL, pDesc VARCHAR ( 255 ) NOT NULL, pImgs bytea[], sellerId VARCHAR ( 255 ) NOT NULL, startDate timestamp NOT NULL, endDate VARCHAR ( 255 ) NOT NULL, maxBid VARCHAR ( 255 ) NOT NULL);', (err:Error, res:any) => {
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
        text: 'INSERT INTO auction_products (p_id,name,pDesc,sellerId,startDate,endDate,maxBid) VALUES($1,$2,$3,$4,$5,$6,$7)',
        values:[uuid(), req.body.name,req.body.pDesc,req.user!.user[0].user_id, new Date(), req.body.endDate,req.body.maxBid],
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
        text: 'INSERT INTO auction_products (p_id,name,pDesc,pImgs,sellerId,startDate,endDate,maxBid) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
        values:[uuid(), req.body.name,req.body.pDesc,imagesArray, req.user!.user[0].user_id,new Date(),req.body.endDate,req.body.maxBid],
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

  router.post('/insertIntoBidTable',async(req: Request, mainRes: Response) => {

    console.log("amount : ", req.body.amount)

      const queryGetBids = {
        text: 'SELECT * From auction_bids WHERE p_id = $1 AND buyerId = $2',
        values:[req.body.p_id, req.user!.user[0].user_id]
      }
  
      pool.query(queryGetBids, (err:Error, res:any) => {
  
        if(err)
        {
          console.log(err.stack);
          return console.error(err.stack);
        }
        else
        {
          
  
         if(res.rows[0] === undefined){


          const query = {
            text: 'INSERT INTO auction_bids (p_id,buyerId,amount) VALUES($1,$2,$3)',
            values:[req.body.p_id, req.user!.user[0].user_id,req.body.amount],
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

              const queryGetMaxBid = {
                text: 'SELECT MAX(amount) From auction_bids GROUP BY p_id HAVING p_id = $1',
                values:[req.body.p_id]
              }
              pool.query(queryGetMaxBid, (err:Error, res:any) => {
                if(err)
                {
                  console.log(err.stack);
                }
                else
                {
                  console.log(res.rows);
                  //mainRes.status(200).send(res.rows)

                  const query = {
                    text: 'UPDATE auction_products SET maxBid = $2 WHERE p_id = $1',
                    values:[req.body.p_id,res.rows[0].max]
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
                      //mainRes.status(200).send(res.rows);
                      
                    }
                  })
                }
              })
              
             
            }
          })
          mainRes.status(200).send("Values Inserted Succesfully !");



         }else{
          if(req.body.amount > res.rows[0].amount){
          
            const query = {
              text: 'UPDATE auction_bids SET amount = $3 WHERE p_id = $1 AND buyerId = $2',
              values:[req.body.p_id, req.user!.user[0].user_id,req.body.amount]
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
                // mainRes.status(200).send(res.rows);

                const queryGetMaxBid = {
                  text: 'SELECT MAX(amount) From auction_bids GROUP BY p_id HAVING p_id = $1',
                  values:[req.body.p_id]
                }
                pool.query(queryGetMaxBid, (err:Error, res:any) => {
                  if(err)
                  {
                    console.log(err.stack);
                  }
                  else
                  {
                    console.log(res.rows);
                    //mainRes.status(200).send(res.rows)
  
                    const query = {
                      text: 'UPDATE auction_products SET maxBid = $2 WHERE p_id = $1',
                      values:[req.body.p_id,res.rows[0].max]
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
                        mainRes.status(200).send(res.rows);
                        
                      }
                    })
                  }
                })
                
              }
            })
  
          }else{
  
            mainRes.status(200).send("Amount Should be Greater than Previous Bid Amount");
          }
         }
          
          
        }
      })   

      // const queryGetMaxBid = {
      //   text: 'SELECT MAX(amount) From auction_bids GROUPBY p_id HAVING p_id = $1',
      //   values:[req.body.p_id]
      // }

  });



  
  router.post('/insertIntoUserTable',async(req: Request, res: Response) => {

    
    const query = {
      text: 'INSERT INTO auction_user (user_id,name,desc,profilePicLink,googleId) VALUES($1,$2,$3,$4,$5)',
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

  router.get('/getProductsList', async(req: Request, mainRes: Response) => {

    const queryGetMaxBid = {
      text: 'SELECT * From auction_products',
      values:[]
    }
    pool.query(queryGetMaxBid, (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        
        mainRes.status(200).send(res.rows)
      }
    })
    
  });


  router.get('/getUserProductsList', async(req: Request, mainRes: Response) => {

    const queryGetMaxBid = {
      text: 'SELECT * From auction_products WHERE sellerId = $1',
      values:[req.user!.user[0].user_id]
    }
    pool.query(queryGetMaxBid, (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        
        mainRes.status(200).send(res.rows)
      }
    })
    
  });

  router.get('/getProduct/:problemId', async(req: Request, mainRes: Response) => {

   // console.log("fasdfsfa",req.user!.user[0].user_id)
   const {problemId} = req.params
    const queryGetMaxBid = {
      text: 'SELECT * From auction_products WHERE p_id = $1',
      values:[problemId]
    }
    pool.query(queryGetMaxBid, (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        mainRes.status(200).send(res.rows)
      }
    })
    
  });


  router.get('/getBidsList', async(req: Request, mainRes: Response) => {

    const queryGetMaxBid = {
      text: 'SELECT * From auction_bids b NATURAL JOIN auction_products p WHERE b.buyerId = $1',
      values:[req.user!.user[0].user_id]
    }
    pool.query(queryGetMaxBid, (err:Error, res:any) => {
      if(err)
      {
        console.log(err.stack);
      }
      else
      {
        mainRes.status(200).send(res.rows)
      }
    })
    
  });




  router.get('/viewMe', async(req: Request, mainRes: Response) => {
  if(req.user)
  {
    mainRes.send(req.user);
  }
  else
  {
    mainRes.send({})
  }
  
    
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
  successRedirect: 'http://localhost:3000',
  failureRedirect: 'http://localhost:3000',
}));

router.get('/users/logout', auth, async (req, res) => {
  req.logout();
  res.redirect(`${process.env.CLIENT_URL}/`);
})

  module.exports = router