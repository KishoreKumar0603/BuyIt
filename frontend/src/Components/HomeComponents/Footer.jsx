import React from 'react';
import '../../assets/css/components/Footer.css';
export const Footer = () => {
  return (
    <footer className="border-top bg-white py-3  footer">
      <div className="container">
        <div className="row text-start">

          {/* About Section */}
          <div className="col-md-2 mb-2">
            <h6 className="text-muted fw-bold">About</h6>
            <ul className="list-unstyled">
              <li><a href="/contact" className="text-decoration-none text-dark">Contact Us</a></li>
              <li><a href="/about" className="text-decoration-none text-dark">About Us</a></li>
              <li><a href="/careers" className="text-decoration-none text-dark">Careers</a></li>
              <li><a href="/services" className="text-decoration-none text-dark">Services</a></li>
            </ul>
          </div>

          {/* Groups Section */}
          <div className="col-md-2 mb-2">
            <h6 className="text-muted fw-bold">Groups</h6>
            <ul className="list-unstyled">
              <li><a href="/groups/architectcovai" className="text-decoration-none text-dark">ArchitectCovai</a></li>
              <li><a href="/groups/geethagarments" className="text-decoration-none text-dark">Geethagarments</a></li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="col-md-2 mb-2">
            <h6 className="text-muted fw-bold">Help</h6>
            <ul className="list-unstyled">
              <li><a href="/payment" className="text-decoration-none text-dark">Payment</a></li>
              <li><a href="/orders" className="text-decoration-none text-dark">Orders</a></li>
              <li><a href="/profiles" className="text-decoration-none text-dark">Profiles</a></li>
              <li><a href="/faq" className="text-decoration-none text-dark">FAQ</a></li>
            </ul>
          </div>

          {/* Consumer Policy Section */}
          <div className="col-md-3 mb-2">
            <h6 className="text-muted fw-bold">Consumer Policy</h6>
            <ul className="list-unstyled">
              <li><a href="/cancellation" className="text-decoration-none text-dark">Cancellation</a></li>
              <li><a href="/return" className="text-decoration-none text-dark">Return</a></li>
              <li><a href="/terms" className="text-decoration-none text-dark">Term of Use</a></li>
              <li><a href="/privacy" className="text-decoration-none text-dark">Privacy</a></li>
              <li><a href="/sitemap" className="text-decoration-none text-dark">Sitemap</a></li>
            </ul>
          </div>

          {/* Developer Details Section */}
          <div className="col-md-3 mb-2">
            <h6 className="text-muted fw-bold">Developer Details</h6>
            <ul className="list-unstyled">
              <li><a href="mailto:kishorekumar5643@gmail.com" className="text-decoration-none text-dark">Kishore Kumar S</a></li>
              <li><a href="mailto:kishorekumar5643@gmail.com" className="text-decoration-none text-dark">kishorekumar5643@gmail.com</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Full-Stacker</a></li>
              <li className="text-muted fw-bold">Social</li>
              <li className="mt-2">
                <a href="https://github.com/KishoreKumar0603" target="_blank" rel="noopener noreferrer" className="me-3 text-dark fs-5">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/kishore-kumar-s-256b10254/" target="_blank" rel="noopener noreferrer" className="me-3 text-dark fs-5">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://www.instagram.com/kishorekumar0603/" target="_blank" rel="noopener noreferrer" className="me-3 text-dark fs-5">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="mailto:kishorekumars5643@gmail.com" rel="noopener noreferrer" className="text-dark fs-5">
                  <i className="fab fa-google-plus-g"></i>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};
