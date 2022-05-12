import e from "express";
import { uuid } from "uuidv4";

const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;
const pool = require("../database/dbConfig")

passport.use( 
    new googleStrategy(
      {
        clientID: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        callbackURL: "/auth/login/callback",
        passReqToCallback: true,
        proxy: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const defaultUser = {
          name:`${profile.name.givenName} ${profile.name.familyName}`,
          email:profile.emails[0].value,
          profilePicLink:profile.photos[0].value,
          googleId:profile.id,
        }
        let user;
        const query = {
            text: 'SELECT * FROM auction_users WHERE email = $1',
            values:[profile.email],
          }
      
          pool.query(query, (err:Error, res:any) => {
            if(err)
            {
              console.log(err.stack);
            }
            else
            {
                 user = res.rows;
                if(user.length === 0)
                {
                    const query = {
                    text: 'INSERT INTO auction_users (user_id,name,email,profilePicLink,googleId) VALUES($1,$2,$3,$4,$5)',
                    values:[uuid(), defaultUser.name,defaultUser.email, defaultUser.profilePicLink,defaultUser.googleId],
                    }
                
                    pool.query(query, (err:Error, res:any) => {
                        if(err)
                        {
                            console.log(err.stack);
                            return console.error(err.stack);
                        }
                        else
                        {
                            console.log("Creating New User And Logging In !");
                            done(null, {user:defaultUser});
                        }
                    })
                }
                else
                {
                done(null, {user:user});
                }           
            }
          })
      }
    )
  );


  // * Passport serializeUser
passport.serializeUser((obj, done) => {
    console.log("Serializing User: ",obj)
    done(null, obj);
  });
  
  // * Passport deserializeUser
  passport.deserializeUser(async (obj, done) => {
    console.log("Deserlializing",obj);
    done(null, obj);
  });