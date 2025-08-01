// src/Pages/ProductList.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Config from '../Config/Config';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { filteredProducts, setFilteredProducts } = useOutletContext();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${Config.backendUrl}/api/products/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status) {
        setProducts(data.products);
        setFilteredProducts(data.products); // Sync to layout state
      } else {
        toast.error(data.message || '❌ Failed to fetch products');
      }
    } catch (err) {
      toast.error('❌ Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${Config.backendUrl}/api/products/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.status) {
        toast.success('🗑️ Product deleted!');
        const updated = products.filter((p) => p._id !== id);
        setProducts(updated);
        setFilteredProducts(updated); // Update filtered list too
      } else {
        toast.error(data.message || '❌ Delete failed');
      }
    } catch (err) {
      toast.error('❌ Server error');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container className="py-5">
      <h3 className="mb-4">📦 All Products</h3>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td>
                  <Image src={p.image} height="50" thumbnail />
                </td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/admin/edit-product/${p._id}`)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default ProductList;
