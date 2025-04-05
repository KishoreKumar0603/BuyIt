import React from 'react';

const products = [
  {
    id: 1,
    title: 'Oppo F11 | 16Ram | 128 Rom | 5000mAh Battery | 5.67inch',
    brand: 'Oppo',
    rating: 3.4,
    price: 999,
    offer: true,
  },
  {
    id: 2,
    title: 'Oppo F11 | 16Ram | 128 Rom | 5000mAh Battery | 5.67inch',
    brand: 'Oppo',
    rating: 3.4,
    price: 999,
    offer: true,
  },
  {
    id: 3,
    title: 'Oppo F11 | 16Ram | 128 Rom | 5000mAh Battery | 5.67inch',
    brand: 'Oppo',
    rating: 3.4,
    price: 999,
    offer: true,
  },
];

export const ProductList = () => {
  return (
    <div className="container my-4">
      {products.map((product) => (
        <div
          className="card mb-3 shadow-sm border-0"
          style={{ backgroundColor: '#fff' }}
          key={product.id}
        >
          <div className="row g-0 align-items-center p-3">
            <div className="col-md-3 text-center">
              <div
                className="bg-secondary bg-opacity-10 rounded"
                style={{ width: '150px', height: '150px', margin: 'auto' }}
              >
                <span className="d-block text-muted pt-5">Image</span>
              </div>
            </div>
            <div className="col-md-9">
              <div className="card-body p-0 ps-4">
                <h6 className=" mb-1">{product.title}</h6>
                <p className="text-muted mb-1">
                  <strong>Brand :</strong> {product.brand}
                </p>
                <p className="text-success mb-1">{product.rating} / 5</p>
                {product.offer && (
                  <p className="text-success fw-semibold mb-1">Special Offer</p>
                )}
                <h5 className="">${product.price}</h5>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
