# Frontend API Layer

This folder contains organized API functions for all backend interactions. Instead of making direct axios calls in components, use these centralized functions for better maintainability and consistency.

## Structure

- `userApi.js` - User authentication and profile management
- `productApi.js` - Product CRUD and search operations
- `cartApi.js` - Shopping cart operations
- `wishlistApi.js` - Wishlist management
- `orderApi.js` - Order placement and management
- `addressApi.js` - User address management
- `adminApi.js` - Admin dashboard functions
- `index.js` - Centralized exports

## Usage

### Import specific functions:

```javascript
import { loginUser, getUserProfile } from "../api/userApi";
import { getProducts, addProductReview } from "../api/productApi";
```

### Or import everything:

```javascript
import * as api from "../api";
```

### Example in component:

```javascript
import { loginUser } from "../api/userApi";

const handleLogin = async () => {
  try {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Benefits

- **Centralized**: All API calls in one place
- **Consistent**: Standardized error handling and response format
- **Maintainable**: Easy to update API endpoints or add interceptors
- **Testable**: Functions can be easily mocked for testing
- **Type-safe**: Clear function signatures with expected parameters

## Error Handling

All API functions will throw errors that should be caught in components. Use try-catch blocks and handle errors appropriately (show user messages, redirect, etc.).

## Authentication

API functions automatically use the axios instance which includes interceptors for authentication headers. Make sure tokens are stored in localStorage.
