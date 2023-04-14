// import React, { useState, useEffect } from 'react';
// import { InputLabel, Select, MenuItem, Button, Grid, Typography, ThemeProvider } from '@mui/material';
// import { useForm, FormProvider } from 'react-hook-form';
// import { Link } from 'react-router-dom';    


// import FormInput from './CustomTextField';
// import commerce from '../lib/commerce';


// const AddressForm = ({ checkoutToken,nextStep, setShippingData,test }) => {
//   const [shippingCountries, setShippingCountries] = useState([]);
//   const [shippingCountry, setShippingCountry] = useState('');
//   const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
//   const [shippingSubdivision, setShippingSubdivision] = useState('');
//   const [shippingOptions, setShippingOptions] = useState([]);
//   const [shippingOption, setShippingOption] = useState('');
//   const methods = useForm();

//   const fetchShippingCountries = async (checkoutTokenId) => {
//     const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

//     setShippingCountries(countries);
//     setShippingCountry(Object.keys(countries)[0]);
//   };

//   const fetchSubdivisions = async (countryCode) => {
//     const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

//     setShippingSubdivisions(subdivisions);
//     setShippingSubdivision(Object.keys(subdivisions)[0]);
//   };

//   const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
//     const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

//     setShippingOptions(options);
//     setShippingOption(options[0].id);
//   };

//   useEffect(() => {
//     fetchShippingCountries(checkoutToken.id);
//   }, []);

//   useEffect(() => {
//     if (shippingCountry) fetchSubdivisions(shippingCountry);
//   }, [shippingCountry]);

//   useEffect(() => {
//     if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
//   }, [shippingSubdivision]);

//   return (
//     <>
//       <Typography variant="h6" gutterBottom>Shipping address</Typography>
//       <FormProvider {...methods}>
//         <form onSubmit={methods.handleSubmit((data) => test({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
//           <Grid container spacing={3}>
//             <FormInput required name="firstName" label="First name" />
//             <FormInput required name="lastName" label="Last name" />
//             <FormInput required name="address1" label="Address line 1" />
//             <FormInput required name="email" label="Email" />
//             <FormInput required name="city" label="City" />
//             <FormInput required name="zip" label="Zip / Postal code" />
//             <Grid item xs={12} sm={6}>
//               <InputLabel>Shipping Country</InputLabel>
//               <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
//                 {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
//                   <MenuItem key={item.id} value={item.id}>
//                     {item.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <InputLabel>Shipping Subdivision</InputLabel>
//               <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
//                 {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
//                   <MenuItem key={item.id} value={item.id}>
//                     {item.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <InputLabel>Shipping Options</InputLabel>
//               <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
//                 {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
//                   <MenuItem key={item.id} value={item.id}>
//                     {item.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>
//           </Grid>
//           <br />
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
//             <Button type="submit" variant="contained" color="primary">Next</Button>
//           </div>
//         </form>
//       </FormProvider>
//     </>
//   );
// };

// export default AddressForm;
import React from 'react'
import { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography, ThemeProvider, Input } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';


import FormInput from './CustomTextField';
import commerce from '../lib/commerce';
function AddressForm({ checkoutToken, nextStep, setShippingData, test }) {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const [firstname, setfirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };
  const methods = useForm();
  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

    setShippingOptions(options);
    setShippingOption(options[0].id);
  };
  console.log("token : ", checkoutToken);
  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);
 const handleSubmit = ((data) => {
    console.log("data is ",data);
    test({ firstname,lastname,address,email,zip, city,shippingCountry, shippingSubdivision, shippingOption })
  } )
  useEffect(() => {
    if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);
  return (
    <div>
      <Typography variant="h6" gutterBottom>Shipping address</Typography>
      <form onSubmit= {handleSubmit}>
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

          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Country</InputLabel>
            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
              {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Subdivision</InputLabel>
            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
              {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Options</InputLabel>
            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
              {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <div className="checkout__column">
            <label>&nbsp;</label>
            {/* <button onClick={()=>history.push("/payment")}>Pay Now</button> */}
            <button type='submit'>Pay Now</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddressForm