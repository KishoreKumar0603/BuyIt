# BuyIt Frontend

## Overview

BuyIt frontend is a React application built with Vite. It renders product pages, cart flows, wishlist features, authentication, order history, and profile management. The UI is responsive using Bootstrap 5 utility classes and grid layout.

## Technologies

- React 19
- Vite
- React Router DOM
- Axios
- JWT Decode
- React Icons
- React Toastify
- Bootstrap 5 (native markup only)
- Local Storage for token and cart caching

## Architecture

- `src/main.jsx`: app entry point that wraps `App` in `AuthProvider`, `AlertProvider`, and `CartProvider`.
- `src/App.jsx`: defines route structure and protects authenticated routes with `PrivateRoute`.
- `src/context/AuthContext.jsx`: manages login state, JWT decoding, and user session.
- `src/context/CartContext.jsx`: keeps cart data synchronized with backend cart API.
- `src/context/axiosInstance.js`: central Axios instance that attaches auth headers automatically.

## Main Pages and Components

- `ProductListing.jsx`: responsive product grid with filtering, sorting, search, and pagination.
- `ProductDetails.jsx`: product details page with Add to Cart and Buy Now.
- `RootCart.jsx`: main cart page showing items, totals, and checkout state.
- `Wishlist.jsx`: wishlist dashboard with move-to-cart and remove actions.
- `Personal.jsx`: profile settings and editable personal fields.
- `Navbar.jsx`: responsive navigation and mobile menu controls.

## How It Works

1. User signs in via `/login` or registers via `/signup`.
2. JWT token is stored in `localStorage` and the auth context is updated.
3. Protected routes require authentication before access.
4. Product pages fetch backend data by category, search, and pagination parameters.
5. Add to Cart and Buy Now trigger backend cart and order APIs.
6. Wishlist updates user state and syncs with the backend.
7. Profile and settings pages use native Bootstrap forms.

## Responsive Design

- Uses Bootstrap 5 grid classes like `row`, `col-md-*`, `col-sm-*`, and responsive utilities.
- Uses responsive image classes such as `img-fluid`.
- No React Bootstrap components are used.

## Usage

- Install dependencies in `frontend` with `npm install`.
- Run the app with `npm run dev`.
- Ensure `VITE_API_URL` points to the backend server.

## Notes

- The project uses Bootstrap 5 via CDN in `index.html`.
- Comment-only lines were removed from source files as requested.
