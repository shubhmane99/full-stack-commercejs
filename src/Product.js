import { useEffect } from 'react'
import { useParams } from 'react-router'
import "./css/product.css"
import Loader from './Loader'
import { useRef } from 'react'
function Product({ productsList, addToCart, fetchProductsByCategory, setLoader, loader }) {
  let { slug } = useParams()
  console.log("slug" + productsList)
  const prevSlug = useRef("")
  useEffect(() => {
    if (slug && slug !== prevSlug.current) {
      setLoader(true);
      fetchProductsByCategory(slug)
        .then(() => {
          // Add a delay before turning off the loader
          setTimeout(() => {
            setLoader(false);
          }, 1000); // Change this value to adjust the delay time
        })
        .catch((error) => {
          console.error(error);
          setLoader(false);
        });

      prevSlug.current = slug;
    }
  }, [slug, fetchProductsByCategory, setLoader]);

  // useEffect(() => {
  // }, [])
  return (
    <div className="products_wrap">
      {
        loader ?
          (
            <Loader />
          )
          :
          (productsList?.map((items) => {
            return <div className="product" key={items.id}>
              <img src={items.image.url} />
              <h3>{items.name}</h3>
              <p>{items.price.formatted_with_symbol}</p>
              <button onClick={() => addToCart(items.id, 1)}>Add to Cart</button>
            </div>

          }))
      }






    </div>
  )

}



export default Product