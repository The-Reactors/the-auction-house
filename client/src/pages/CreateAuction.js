import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import SinglePageLoader from '../Components/singlePageLoader';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@material-ui/core/Typography';

const CreateAuction = () => {
    
    const [productInfo, setProductInfo] = useState(undefined);
    
//     const getProducts = () => {
//       fetch(`http://localhost:5000/getProductsList`,  {credentials: "include"})
//       .then(async response => {
//           if(response.ok){
//               response.json().then(data => {
//                   console.log(data)
//                   setProductInfo(data);
//               });
//            }
//           else{
//               throw response.json();
//           }
//         })
//         .catch(async (error) => {
         
//           const errorMessage = await error;
//           console.log(errorMessage)
//         })
//     }
  
//     useEffect(() =>{
//       getProducts();
//   }, [])

    
  return (
      <>
      {productInfo !== undefined ? ( <SinglePageLoader /> )  : (
          <>
            <h2>Enter All Details Of The Product</h2>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '45ch'},
                    border:"1 px solid grey",
                }}
                noValidate
                autoComplete="off" >
                <div>
                <Typography variant="h6" component="h2">
                         Name Of The Product
                </Typography>   
                    <TextField id="outlined-basic" label="Name" variant="outlined" />
                <Typography variant="h6" component="h2">
                         Description Of The Product
                </Typography>   
                <TextField
                    fullWidth 
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={7}
                    placeholder="Give A Brief Description Of The Condition Of The Product And Justify Its Starting Value."
                    />
                    <Typography variant="h6" component="h2">
                        Select End Time Of Auction
                    </Typography>  
                    <input style = {{"border":"2px solid #999999"}}type="datetime-local" id="end_auction_date" name="end-auction-date"/>
                </div>
            </Box>
          </>
      ) }
      
      </>      
  );

}
export default CreateAuction;
