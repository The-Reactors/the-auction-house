import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card } from 'react-bootstrap';
import Rating from '../Components/rating';
import { Select, Button, FormControl, makeStyles, MenuItem } from '@material-ui/core/';
import SinglePageLoader from "../Components/singlePageLoader";
import noImage from "../assets/no-image.jpg"

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 85,
    top: -17,
    left: 6,
    position: 'absolute',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ProductDetails = () => {

  const params = useParams();
  const productId = params.productId;
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const [prodDetails, setProdDetails] = useState({
    name:"",
    desc:"",
    maxBid:"",
    
})

const [img, setImg] = useState(false);
const [imagePresent, setImagePresent] = useState(false);





  
const getProduct = () => {

  fetch(`http://localhost:5000/getProduct/${productId}`, {credentials: "include"})
            .then((response) => {
                response.json().then((problems) => {
                    //setIssues(problems)
                    // updateIssues(problems)
                    
                    // refreshCard === true ? setRefreshCard(false) : setRefreshCard(true)
                 
                    // setIsLoadingHome(false)
                    // setIsLoadingHome(false)
                    console.log(problems[0])
                     
                    setProdDetails({
                      name:problems[0].name,
                      desc:problems[0].pdesc,
                      maxBid:problems[0].maxbid,
                      
                    })

                    


                    if(problems[0].pimgs.length)
                     {
                        setImagePresent(true)
                        
                        let imagesFinal = []
                        imagesFinal[0] = new Buffer(problems[0].pimgs[0]).toString("base64")
                        setImg(imagesFinal)
                      }
                    
            })
        })

}


        useEffect(() =>{
          getProduct();
      }, [])



  return (
    <>

      <Link className="btn btn-light my-3" to= '/'>
        Go Back
      </Link>
      {loading ? (
        <SinglePageLoader />
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={noImage} alt="dfsjn" fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>sfdfn</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={3434}
                    text={`78 reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: {prodDetails.maxBid}</ListGroup.Item>
                <ListGroup.Item>Description: 23423</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>$234324</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                </ListGroup>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>Active</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                </ListGroup>
              </Card>
            </Col>
          </Row>
         
        </>
      )}
    </>
  );
};
export default ProductDetails;
