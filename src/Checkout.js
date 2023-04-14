import { Input } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import "./css/checkout.css"
import commerce from "./lib/commerce";
function Checkout({cart,setOrder}) {
    const history = useHistory();
    const [firstname, setfirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");


const [generatedtoken,setToken] = useState({});
const [countiesList, setCountriesList] = useState([])
const [subdivisionList, setSubdivisionList] = useState([])
const [shippingOptions,setShippingOptions]=useState(null);
const [country,setCountry]=useState(null);
const [subdivision,setSubdivision]=useState(null);
const [shipping,setShipping]=useState(null);

    const getShippingCountries = async(tokenID)=>{
       const {countries} =  await commerce.services.localeListShippingCountries(tokenID);
       setCountriesList(Object.entries(countries));
    }

    const getShippingSubdivision = async(country)=>{
        const {subdivisions} =  await commerce.services.localeListSubdivisions(country);
        setSubdivisionList(Object.entries(subdivisions));
        setSubdivision(Object.keys(subdivisions)[0]);
       
    }

    const getShippingOptions = async(tokenID,c,s)=>{
       const response =  await commerce.checkout.getShippingOptions(tokenID.id, {
            country: c,
            region: s,
          })
          setShipping(response[0].id)
          setShippingOptions(response);
    }

    
    useEffect(()=>{
        const generateToke = async(cartID)=>{
            const token = await commerce.checkout.generateToken(cartID , { type: 'cart' })
            setToken(token);
console.log(token)
            getShippingCountries(token.id);
        }

        generateToke(cart?.id);
       
    },[cart])

    useEffect(()=>{
        if(country) { getShippingSubdivision(country); }
        
    },[country])

    useEffect(()=>{
        if(subdivision) { getShippingOptions(generatedtoken,country,subdivision); }
        
    },[subdivision])


    const handleSubmit=async(e)=>{
e.preventDefault();
if(generatedtoken)
{
  const incomingOrder = await  commerce.checkout.capture(generatedtoken.id, {
    line_items: generatedtoken.line_items,
    customer: {
      firstname: firstname,
      lastname: lastname,
      email: email
    },
    shipping: {
      name: 'Primary',
      street: address,
      town_city: city,
      county_state: subdivision,
      postal_zip_code: zip,
      country: country
    },
    fulfillment: {
      shipping_method: shipping
    },
   
    payment: {
        gateway: 'stripe',
        card: {
          number: '4242424242424242',
          expiry_month: '02',
          expiry_year: '24',
          cvc: '123',
          postal_zip_code: '94107',
        },
    },
    pay_what_you_want: 150
  })

  setOrder(incomingOrder);
  history.push("/thankyou");
  console.log(incomingOrder)
}


}
    return (
        <div className="checkout_wrap">
            <h2>Shipping Details</h2>
            <br/>
            <form onSubmit={e=>handleSubmit(e)}>
                <div className="checkout__form">
                <div className="checkout__column">
                    <label>First Name*</label>
                    <Input required name="firstname" value={firstname} onChange={e=>setfirstName(e.target.value)}/>
                </div>

                <div className="checkout__column">
                    <label>Last Name*</label>
                    <Input required name="lastname"  value={lastname} onChange={e=>setLastName(e.target.value)}/>
                </div>

                <div className="checkout__column">
                    <label>Address*</label>
                    <Input required name="address"  value={address} onChange={e=>setAddress(e.target.value)}/>
                </div>


                <div className="checkout__column">
                    <label>Email*</label>
                    <Input required name="email"  value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>


                <div className="checkout__column">
                    <label>City*</label>
                    <Input required name="city"  value={city} onChange={e=>setCity(e.target.value)}/>
                </div>

                <div className="checkout__column">
                    <label>Zipcode*</label>
                    <Input required name="zipcode"  value={zip} onChange={e=>setZip(e.target.value)}/>
                </div>

                
                <div className="checkout__column">
                    <label>Shipping Country</label>
                    <select name="country" value={country} onChange={e=>setCountry(e.target.value)}>
                        {
                            countiesList?.map(country=>{
                                        return  <option value={country[0]}>{country[1]}</option>
                            })
                        }
                       
                    </select>
                </div>
                <div className="checkout__column">
                    <label>Shipping Subdivision</label>
                    <select value={subdivision} name="subdivision"  onChange={e=>setSubdivision(e.target.value)}>
                    {
                            subdivisionList?.map(subdivision=>{
                                        return  <option value={subdivision[0]}>{subdivision[1]}</option>
                            })
                        }
                    </select>
                </div>

                <div className="checkout__column">
                    <label>Shipping Options</label>
                    <select name="subdivision" value={shipping} onChange={e=>setShipping(e.target.value)}>
                        {
                            shippingOptions?.map(item=>{
                                return <option value={item.id}>{item.description} {item.price.formatted_with_symbol}</option>
                            })
                        }
                        
                    </select>
                </div>

                <div className="checkout__column">
                    <label>&nbsp;</label>
                    <button onClick={()=>history.push("/payment")}>Pay Now</button>
                </div>
                </div>
            </form>
        </div>
    )
}

export default Checkout
