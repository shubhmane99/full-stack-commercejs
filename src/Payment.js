import React, { Fragment, useEffect, useRef,useState } from "react";
import MetaData from "./MetaData";
import { Typography } from '@mui/material'
// import { Input } from '@mui/material'
// import { useHistory } from 'react-router';
import "./css/checkout.css"
import commerce from "./lib/commerce";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./payment.css";
import { URL } from "./backend";
// import CreditCardIcon from "@material-ui/icons/CreditCard";
// import EventIcon from "@material-ui/icons/Event";
// import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = ({ history,cart,setOrder }) => {


 

  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

 const [generatedtoken,setToken] = useState({});


  
  useEffect(()=>{
      const generateToke = async(cartID)=>{
          const token = await commerce.checkout.generateToken(cartID , { type: 'cart' })
          setToken(token);
console.log(token)
        //   getShippingCountries(token.id);
      }

      generateToke(cart?.id);
     
  },[cart])


  const paymentData = {
    amount: Math.round(10 * 100),
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${URL}/api/v1/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: "test",
            email: "test@gmail.com",
            address: {
              line1: "pune",
              city: "pune",
              state: "Maharashtra",
              postal_code: 110110,
              country: "IN",
            },
          },
        },
      });   
      console.log("result : ",result);
      if (result.error) {
        payBtn.current.disabled = false;

        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
        //   order.paymentInfo = {
        //     id: result.paymentIntent.id,
        //     status: result.paymentIntent.status,
        //   };
            console.log("succeed");
          const incomingOrder = await  commerce.checkout.capture(generatedtoken.id, {
            line_items: generatedtoken.line_items,
            customer: {
              firstname: "user",
              lastname: "user1",
              email: "user@gmail.com"
            },
            shipping: {
              name: 'Primary',
              street: "pune",
              town_city: "pune",
              county_state: "pune",
              postal_zip_code: 110110,
              country: "India"
            },
            fulfillment: {
              shipping_method: "ship_RqEv5x0N15Zz4j"
            },
            payment: {  
                gateway: 'stripe',
                stripe: {
                  payment_method_id: result.payment_method,
                },
                
              },
            // payment: {
            //     gateway: 'test_gateway',
            //     card: {
            //       number: '4242424242424242',
            //       expiry_month: '02',
            //       expiry_year: '24',
            //       cvc: '123',
            //       postal_zip_code: '94107',
            //     },
            // },
            pay_what_you_want: paymentData.amount
          })        
          console.log("shubham")
        //   history.push("/success");
        } else {
          alert.error("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
    //   alert.error(error.response.data.message);
    }
  };

//   useEffect(() => {
//     if (error) {
//       alert.error(error);
//       dispatch(clearErrors());
//     }
//   }, [dispatch, alert]);

  return (
    
    <div>
    <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            {/* <CreditCardIcon /> */}
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            {/* <EventIcon /> */}
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            {/* <VpnKeyIcon /> */}
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${100}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </div>
   
  );
};

export default Payment;
