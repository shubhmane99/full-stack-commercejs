import React, { useState } from 'react';
import { Typography, Button, Divider,CircularProgress ,Link} from '@mui/material';
import { Elements, CardElement, ElementsConsumer} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';
import commerce from '../lib/commerce';

const stripePromise = loadStripe("pk_test_51MqIfDSHBLtZ1vQecAzOjz9T5aOs0jwDM8B8Uah1izfy14TgMV750uWerGoX0DEYXHysyuTHr5v40PE3yYb2gEcY00bv3W2qLT");

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout,setOrder }) => {
  console.log("shipping data",shippingData);
  const [isDisable,setDisable] = useState(false);
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();
    setDisable(true)
    let orderDetails;
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    console.log("card element",cardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod(
      {
        type: 'card',
        card: cardElement,
      }
      
    );

    if (error) {
      console.log('[error]', error);
    } else {
      const orderData = {
        line_items: checkoutToken.line_items,
        customer: { firstname: shippingData.firstname, lastname: shippingData.lastname, email: shippingData.email },
        shipping: { name: 'International', street: shippingData.address, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };

      console.log("order data ",orderData);
      try{
        const res =  await commerce.checkout.capture(checkoutToken.id, orderData);
        
      }catch(resposone) {
        
        const cardActionResult = await stripe.handleCardAction(resposone.data.error.param)
        console.log("card action result",cardActionResult);
        orderDetails =  await commerce.checkout.capture(checkoutToken.id, 
         {
           line_items: checkoutToken.line_items,
           customer: { firstname: shippingData.firstname, lastname: shippingData.lastname, email: shippingData.email },
           shipping: { name: 'International', street: shippingData.address, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
           fulfillment: { shipping_method: shippingData.shippingOption },
           payment: {
             gateway: 'stripe',
             stripe: {
               payment_intent_id: cardActionResult.paymentIntent.id,
             },
           },
         }
         );
        
         setOrder(orderDetails);
         setDisable(false)
        //  console.log("checkout id data ",);
       
      }

      // await onCaptureCheckout(checkoutToken.id, orderData);

      nextStep();
    }
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>{({ elements, stripe }) => (
          <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
            <CardElement />
            <br /> <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={backStep}>Back</Button>
              <Button  type="submit" variant="contained" disabled={!stripe || isDisable} color="primary">
                Pay {checkoutToken.subtotal.formatted_with_symbol}
              </Button>
            </div>
          </form>
        )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
