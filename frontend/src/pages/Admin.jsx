import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../api/productApi";
import "../assets/css/pages/Admin.css";

export const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: { main: "", sub: "" },
    stock: "",
    price: "",
    rating: "",
    features: "",
    description: "",
  });

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProducts();
      fetchCategories();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data.products) ? data.products : data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      // This would need a categories API endpoint
      // For now, using hardcoded categories
      setCategories([
        "electronics",
        "clothing",
        "books",
        "home_garden",
        "sports_outdoors",
        "toys_games",
        "beauty_personal_care",
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "main" || name === "sub") {
      setFormData((prev) => ({
        ...prev,
        category: {
          ...prev.category,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        toast.success("Product updated successfully");
      } else {
        await addProduct(formData);
        toast.success("Product added successfully");
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || "",
      brand: product.brand || "",
      category: {
        main: product.category?.main || product.category || "",
        sub: product.category?.sub || "",
      },
      stock: product.stock || "",
      price: product.price || "",
      rating: product.rating || "",
      features: product.features || "",
      description: product.description || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      brand: "",
      category: { main: "", sub: "" },
      stock: "",
      price: "",
      rating: "",
      features: "",
      description: "",
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Panel - Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "Add New Product"}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>{editingProduct ? "Edit Product" : "Add New Product"}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Brand *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      name="main"
                      value={formData.category.main}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sub Category</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sub"
                      value={formData.category.sub}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <input
                      type="number"
                      className="form-control"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Features</label>
                    <textarea
                      className="form-control"
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Products ({products.length})</h5>
        </div>
        <div className="card-body">
          {products.length === 0 ? (
            <p className="text-muted">No products found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td>{product.brand}</td>
                      <td>{product.category?.main || product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.rating || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
