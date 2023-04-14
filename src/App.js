import Header from "./Header";
import Product from "./Product";
import {BrowserRouter as Router,Switch, Route,} from "react-router-dom";
import ShoppingCart from "./ShoppingCart"
import commerce from "./lib/commerce";
import { useEffect, useState } from "react";
// import Checkout from "./Checkout";
import Thankyou from "./Thankyou";
import Loader from "./Loader";
import { useParams } from 'react-router'
import { Alert } from "@mui/material";
import Payment from "./Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { URL } from "./backend";
import Checkout from "./CheckoutForm/Checkout/Checkout";






function App() {
  console.log("APp js");
  const [productsList,setProductsList] = useState([]);
  const [productsListByCategory,setProductsListByCategory] = useState([]);
  const [categoryList,setCategoryList] = useState([]);
  const [cart,setCart] = useState([]);
  const [orderDetails,setOrderDetails] = useState({});
  const [loader , setLoader] = useState(true)
  const [stripeApiKey, setStripeApiKey] = useState("");

  // async function getStripeApiKey() {
  //   const { data } = await axios.get(`${URL}/api/v1/stripeapikey`);

  //   setStripeApiKey(data.stripeApiKey);
  // }
   const fetchProducts = async()=>{
    const response = await commerce.products.list();
    setProductsList(response.data);
  

   }

   const fetchProductsByCategory = async(category)=>{
   
    const response = await commerce.products.list({
      category_slug:[category]
    });
   
    setProductsListByCategory(response.data);
  
   }

   const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      console.log("caputer data :",incomingOrder);
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
      setOrder(incomingOrder);

      // refreshCart();
    } catch (error) {
      // setErrorMessage(error.data.error.message);
    }
  };
   const addToCart = async(productId,qunatity)=>{

   const response = await commerce.cart.add(productId,qunatity);
    setCart(response.cart)
    await fetchCart();
    alert("Item Added to cart")
    
   }
   const fetchCart=async()=>{
    setCart(await commerce.cart.retrieve())
   }
    
   const removeFromCart=async(productId)=>{
    const responsce = await commerce.cart.remove(productId);
    setCart(responsce.cart);
   fetchCart();

   }

   const fetchCategories = async()=>{
    const response = await commerce.categories.list();
   setCategoryList(response.data);
   }
   
  
   const setOrder = (order)=>{
    setOrderDetails(order)
   }
    useEffect(() => {
    // getStripeApiKey();
   fetchProducts();
   fetchCart();
   fetchCategories();
  }, [])

  return (
   <Router>
    <div className="App">
    <Header cart={cart} categoryList={categoryList}/>
     <Switch>
      <Route exact path="/">
          <div className="banner">
                 <img alt="" src="https://m.media-amazon.com/images/I/51kTbfe008L._SX1500_.jpg"/>
               </div>
           <Product productsList={productsList} addToCart={addToCart}/> 
          </Route>

          <Route exact path="/cart">
           <ShoppingCart cart={cart} removeFromCart={ removeFromCart}/>
           </Route>
           
           
           <Route exact path="/category/:slug"> 
          <div style={{marginBottom:"320px"}}></div>
         
          <Product productsList={productsListByCategory} fetchProductsByCategory={fetchProductsByCategory} setLoader={setLoader} loader={loader} addToCart={addToCart}/> 
      
           </Route>

           <Route exact path="/checkout">
           <Checkout cart={cart} orderDetails={orderDetails} onCaptureCheckout={handleCaptureCheckout} />
           </Route>
{/* 
           {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
             <Route exact path="/payment">
                 <Payment cart={cart} setOrder={setOrder} />
           </Route>
        </Elements>
         )} */}

           
           <Route exact path="/thankyou">
           <Thankyou orderDetails={orderDetails}/>
           </Route>
           

            </Switch>
        </div>
        </Router>

  )};
  

export default App;
