import React, { useState } from 'react';
import { Typography, Button, Divider,CircularProgress ,Link} from '@mui/material';
import { Elements, CardElement, ElementsConsumer} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';
import commerce from '../lib/commerce';

const stripePromise = loadStripe("pk_test_51MqIfDSHBLtZ1vQecAzOjz9T5aOs0jwDM8B8Uah1izfy14TgMV750uWerGoX0DEYXHysyuTHr5v40PE3yYb2gEcY00bv3W2qLT");

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout,setOrder }) => {
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
      alert(error.message)
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
        // extra_fields: {
        //   pay_what_you_want: checkoutToken.total.raw, // Replace "customAmount" with your own variable
        // },
      };
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
      // try {
      //   let ammount = parseFloat(checkoutToken.total.formatted);
      //   const order = await commerce.checkout.capture(checkoutToken.id, {
      //     ...orderData,
      //     // Include Stripe payment mmethod ID:
      //     payment: {
      //       gateway: 'stripe',
      //       stripe: {
      //         payment_method_id: paymentMethod.id,
      //       },
      //     },
      //   })
      //   return;
      // } catch (response) {
      //   // We can check if the error is not related to additional payment steps being required
      //   if (response.statusCode !== 402 || response.data.error.type !== 'requires_verification') {
      //     // Handle the error as usual because it's not related to 3D secure payments
      //     console.log(response);
      //     return;
      //   }
      
      //   // Otherwise we need to continue with the 3DS process. We can use the Stripe SDK to show a modal to the customer.
      //   // Commerce.js provides us the "param" attribute that refers to a PaymentIntent that was created with Stripe by the
      //   // Chec API.
      //   const cardActionResult = await stripe.handleCardAction(response.data.error.param)
      
      //   if (cardActionResult.error) {
      //     // The customer failed to authenticate themselves with their bank and the transaction has been declined
      //     alert(cardActionResult.error.message);
      //     return;
      //   }
      
      //   // Now we can try to capture the order again, this time passing the payment intent ID:
      //   try {
      //     const order = await commerce.checkout.capture(checkoutToken.id, {
      //       payment: {
      //         gateway: 'stripe',
      //         stripe: {
      //           payment_intent_id: cardActionResult.paymentIntent.id,
      //         },
      //       },
      //     });
      
      //     // If we get here the order has been captured successfully and the order detail is available in the order variable
      //     console.log(order);
      //     return;
      //   } catch (response) {
      //     // Just like above, we get here if the order failed to capture with Commrece.js
      //     console.log(response);
      //     alert(response.message);
      //   }
      // }

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
