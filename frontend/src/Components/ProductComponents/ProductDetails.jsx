import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axiosInstance from '../../context/axiosInstance';

export const ProductDetails = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [redirectToOrderConfirmation, setRedirectToOrderConfirmation] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${category}/${id}`);
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [category, id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
  
      await axiosInstance.post(
        "/api/cart/add",
        {
          productId: product._id,
          category,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      currentCart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(currentCart));
  
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to add to cart.");
    }
  };
  
  const buyNow = async () => {
    try {
      const token = localStorage.getItem("token");
  
      await axiosInstance.post(
        '/api/orders/place',
        {
          products: [
            {
              productId: product._id,
              category: category,
              quantity: 1,
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Clear the cart and redirect
      localStorage.removeItem('cart');
      setRedirectToOrderConfirmation(true);
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to place order.");
    }
  };
  

  if (!product) {
    return <div className="text-center py-5 box">Loading...</div>;
  }

  if (redirectToOrderConfirmation) {
    return <Navigate to="/order-success" />;
  }

  return (
    <div className="container py-5 box">
      <div className="row p-3">
        <div className="col-md-6 mb-4">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <img
              src={product.image_url}
              alt={product.name}
              className="img-fluid object-fit-contain"
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          <div className="d-flex justify-content-center mt-4 gap-3">
            <button className="btn btn-dark px-4 py-2" onClick={addToCart}>Add to Cart</button>
            <button className="btn btn-dark px-4 py-2" onClick={buyNow}>Buy Now</button>
          </div>
        </div>

        <div className="col-md-6">
          <h4>{product.title || "Product Name"}</h4>
          <p className="mt-3 secondary"><strong>Brand :</strong> {product.brand}</p>
          <p className="text-success">Special Offer</p>
          <h3 className="text-dark">₹{product.price}</h3>
          <p className="badge bg-success">{product.rating} / 5 </p>
          <p className='secondary'><strong>Available Qty :</strong> {product.stock}</p>

          <hr className="my-4" />
          
          <h5>Product Details</h5>
          <p className="secondary">{product.description || product.title}</p>

          <h5 className="mt-4">Key Features</h5>
          <ul className="list-unstyled">
            {
              product.features ? product.features.map((feature, index) => (
                <li key={index} className="mb-2 d-flex align-items-start secondary">
                  <span className="me-2">📌</span> <span>{feature}</span>
                </li>
              )) : <p className='secondary'>{category}</p>
            }
          </ul>
        </div>
      </div>
    </div>
  );
};
