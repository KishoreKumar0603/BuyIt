# BuyIt Backend

## Overview

BuyIt backend is a Node.js and Express application that provides REST APIs for authentication, product catalog, cart management, wishlist, orders, addresses, and admin operations. It uses MongoDB with dynamic product category modeling and JWT-based authentication.

## Technologies

- Node.js
- Express
- MongoDB with Mongoose
- Passport.js for Google OAuth
- JWT authentication
- CORS
- dotenv
- express-session
- rate-limit

## Architecture

- `server.js`: entry point and route mounting.
- `routes/`: express routes for user, product, cart, wishlist, orders, categories, addresses, admin, and forgot password.
- `controllers/`: request handling logic separated from route definitions.
- `models/`: Mongoose schemas for users, carts, wishlist, orders, and product category collections.
- `middleware/`: authentication and admin authorization guards.

## API Routes

### Authentication and User

- `POST /api/user/login`: user login, returns JWT token.
- `POST /api/user/register`: register new user with rate limiting.
- `POST /api/user/verify`: verify user account.
- `POST /api/user/refresh`: refresh JWT tokens.
- `GET /api/user/auth/google`: start Google OAuth.
- `GET /api/user/auth/google/callback`: Google OAuth callback.
- `POST /api/user/complete-profile`: complete user profile after OAuth.
- `GET /api/user/my-profile`: get authenticated user profile.
- `PATCH /api/user/update`: update user fields.
- `PUT /api/user/change-password`: change password.
- `DELETE /api/user/delete`: delete authenticated user.

### Product Catalog

- `GET /api/products`: list products and support query filters.
- `GET /api/products/:category/:id`: fetch product details by category and ID.
- `POST /api/products`: admin creates a product.
- `DELETE /api/products/:id`: admin deletes a product.
- `PUT /api/products/:id`: admin updates a product.
- `POST /api/products/:category/:id/review`: authorized users add a review.

### Categories

- `GET /api/products/category`: list available product categories.

### Cart

- `GET /api/cart`: retrieve authenticated user cart.
- `POST /api/cart/add`: add a product to cart with quantity validation.
- `PUT /api/cart/update`: update cart item quantity.
- `PATCH /api/cart/update/:itemId`: patch a cart item quantity.
- `DELETE /api/cart/remove/:productId`: remove a cart item.
- `DELETE /api/cart/clear`: clear the user cart.

### Wishlist

- `POST /api/wishlist/add`: add a product to the wishlist using category validation.
- `GET /api/wishlist/my-wishlist`: retrieve wishlist products.
- `POST /api/wishlist/remove`: remove a product from wishlist.

### Orders

- `POST /api/orders/place`: place an order, decrement stock, save order, and clear cart.
- `GET /api/orders/my-orders`: fetch paginated orders for a user.
- `DELETE /api/orders/:orderId`: cancel an order when pending.
- `GET /api/orders/all-orders`: admin order list with filters.
- `PUT /api/orders/update-status/:orderId`: admin updates order status.

## How It Works

- The backend validates requests using JWT tokens and protects endpoints with `isAuth` middleware.
- Product category data uses dynamic Mongoose models so category collections can be managed without fixed schemas.
- Cart and wishlist are tied to authenticated users and store product references plus category metadata.
- Order placement ensures stock availability and saves ordered items as a separate order record.
- Admin routes are protected by `isAdmin` middleware to allow product and order management.

## Why It Works This Way

- The API is designed to separate responsibilities: user management, product catalog, cart, wishlist, and orders.
- Dynamic category modeling allows the frontend to request products from any category collection.
- JWT authentication provides secure session management for protected routes.
- Clear route separation makes the backend easier to maintain and scale.

## Running the Backend

- Install dependencies in `backend` with `npm install`.
- Set environment variables for `MONGO_URI`, `JWT_SECRET`, and `PORT`.
- Run the server with `node server.js` or an equivalent script.
