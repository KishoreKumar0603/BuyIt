import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const ProductDetails = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${category}/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [category, id]);

  if (!product) {
    return <div className="text-center py-5 box">Loading...</div>;
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
            <button className="btn btn-dark px-4 py-2">Add to Cart</button>
            <button className="btn btn-dark px-4 py-2">Buy Now</button>
          </div>
        </div>

        <div className="col-md-6">
          <h4 className="">
            {product.title || "Product Name"}
          </h4>
          <p className="mt-3 secondary"><strong>Brand :</strong> {product.brand}</p>
          <p className="text-success">Special Offer</p>
          <h3 className="text-dark">₹{product.price}</h3>
          <p className="text-success">{product.rating} / 5</p>
          <p className='secondary'><strong>Available Qty :</strong> {product.stock}</p>

          <hr className="my-4" />
          
          <h5 className="">Product Details</h5>
          <p className="secondary">{product.description || product.title}</p>

          <h5 className="mt-4">Key Features</h5>
          <ul className="list-unstyled">
            {
                product.features ? product.features?.map((feature, index) => (
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
