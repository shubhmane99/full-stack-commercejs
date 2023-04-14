import React from 'react'
import { useHistory } from 'react-router'

import"./css/Cart.css"
function ShoppingCart({cart,removeFromCart}) {
    const history = useHistory()
  return (
    <div className="checkout">
        <div className="checkout__left">
          <img alt='' src="https://images-eu.ssl-images-amazon.com/images/G/31/prime/Shopping_Feb22/1500x250PCbanneFeb22.jpg"
          className="checkout__add"/>
       <div>
        <h3>Hello Mahaveer</h3>
        <h2 className="checkout__title">Your Shopping Basket</h2>

        {
          cart?.line_items?.map((item)=>{
            return <div className="checkoutProduct" key={item.id}>
            <img src={item.image.url}/>
    
    
             <div className="checkoutProduct__info">
          <p className="checkoutProduct__title">{item.name}</p>
          <p className="checkoutProduct__Price">
              <strong>{item.price.formatted_with_symbol} * {item.quantity} = {cart.currency.symbol} {item.price.raw *
              item.quantity}</strong>
              </p>
                 <button onClick={()=>removeFromCart(item.id)}>Remove from Basket</button>
              </div>
           </div>
          })
        }
        
        </div>
        </div>
        
         <div className="checkout__right">
          <div className="subtotal">
            <p>Subtotal ({cart?.total_item}item): <strong>{cart?.subtotal?.formatted_with_symbol}</strong></p>
            <small className="Subtotal__gift">
                <input type="checkbox"/> This order contains a gift
            </small>
          </div>

          <button onClick={()=>history.push("/checkout")}>Proceed to Checkout</button>
        </div>
        </div>

  
  
)}

export default ShoppingCart