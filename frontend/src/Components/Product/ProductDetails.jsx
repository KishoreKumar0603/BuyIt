import React from 'react';

export const ProductDetails = () => {
  return (
    <div className="container box">
      <div className="row bg-white p-4">
        
        {/* Left Column - Image and Buttons */}
        <div className="col-md-6 d-flex flex-column">
          <div className="bg-secondary bg-opacity-25 w-100 mb-4 rounded d-flex align-items-center justify-content-center" style={{ height: '380px' }}>
            <span className="text-muted">Product Image</span>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-dark w-50 me-2">Add to Cart</button>
            <button className="btn btn-dark w-50 ms-2">Buy Now</button>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="col-md-6">
          <h4>Oppo F11 16Ram | 128 Rom | 5.67 inc | 5000mAH</h4>
          <p className='secondary'><strong>Brand :</strong> Oppo</p>
          <p className="text-success fw-semibold">Special Offer</p>
          <h3 className="fw-bold">$ 999</h3>
          <p className="text-success">3.4 / 5</p>
          <p className='secondary'>Available Qty : <strong>17</strong></p>

          <hr />

          <h5 className="mb-3">Product Details</h5>
          <p className='secondary'>
            Experience seamless multitasking and powerful performance with the Oppo F11, engineered to elevate your smartphone experience. Boasting an impressive 16GB RAM and 128GB internal storage, this device lets you run multiple apps, games, and media without a hitch, while offering ample online space for all your photos, videos, and files.
          </p>
          <p className='secondary'>
            The 5.67-inch vibrant display delivers crystal-clear visuals with stunning color accuracy, perfect for streaming, gaming, and browsing. Whether you're indoors or out, enjoy immersive viewing in the palm of your hand.
          </p>
          <p className='secondary'>
            Powered by a massive 5000mAh battery, the Oppo F11 keeps up with your busy lifestyle. Stay connected, entertained, and productive all day without worrying about running out of power.
          </p>

          <h5 className="mt-4">Key Features</h5>
          <ul className="list-unstyled secondary">
            <li >📱 <strong>16GB RAM</strong> – Ultra-smooth performance & lightning-fast multitasking</li>
            <li>💾 <strong>128GB ROM</strong> – Store more, delete less</li>
            <li>🖥️ <strong>5.67” HD Display</strong> – Sharp visuals with immersive clarity</li>
            <li>🔋 <strong>5000mAh Battery</strong> – Long-lasting battery for all-day usage</li>
            <li>🎯 Stylish design with smart camera features (optional to customize)</li>
            <li>⚡ Fast connectivity and responsive interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
