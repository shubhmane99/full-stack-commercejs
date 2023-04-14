import React from 'react';
import "./css/header.css"
import { FaSearch } from 'react-icons/fa';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Link} from 'react-router-dom';
function Header({cart,categoryList}) {
    return (
        <>
        <div className="header">
            <Link to="/">
            <img alt='' src="https://e7.pngegg.com/pngimages/569/285/png-clipart-amazon-com-amazon-books-online-shopping-amazon-logo-text-computer.png" className="header__logo"/>
           </Link>
         <div className="header__search">
            <input type="text"/>
            <FaSearch className='header__searchIcon'/>
         </div>

          <div className="header__nav">
          <div className="header__option">
                <span className="header__OptionLineOne">Hello Guest</span>
                <span className="header__OptionLineTwo">Sign In</span>
                </div>

                <div className="header__option">
                <span className="header__OptionLineOne">Return</span>
                <span className="header__OptionLineTwo">& orders</span>
                </div>

                <div className="header__option">
                <span className="header__OptionLineOne">Your</span>
                <span className="header__OptionLineTwo">Prime</span>
                </div>

                <div className="header__optionBasket">
                    <Link to="/cart">
                    <ShoppingCartIcon/>
                    <span>
                    {cart?.total_items}
                    </span>
                    </Link>
                </div>
              
          
                 
            </div>
         </div>
         <div className="header__bottom">
          <ul>
            {
              categoryList?.map(category=>{
                return <li key={category.id}>
                   <Link to={`/category/${category.slug}`}>
                  {category.name}
                  </Link>
                  </li>
              })
            }
           
            <li>
                <img alt='' src="https://m.media-amazon.com/images/G/31/img17/Home/AmazonTV/Ravina/Desktop/SWM_300x39_SIXER02._CB606007416_.jpg"/>
            </li>
          </ul>
         </div>
         </>
    
  )
}

export default Header
            
           
        
    


