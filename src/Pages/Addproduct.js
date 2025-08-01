import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Config from '../Config/Config';

function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
  });

  const [previewImage, setPreviewImage] = useState('');
  const { id } = useParams(); // Get ID from URL if editing
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const isEditMode = Boolean(id);

  // Fetch product if editing
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${Config.backendUrl}/api/products`);
        const data = await res.json();
        if (data.status) {
          const found = data.products.find(p => p._id === id);
          if (found) {
            setProduct(found);
            setPreviewImage(found.image);
          } else {
            toast.error('❌ Product not found');
            navigate('/admin/products');
          }
        }
      } catch (err) {
        toast.error('❌ Error fetching product');
      }
    };

    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });

    if (name === 'image') {
      setPreviewImage(value);
    }
  };

  // Handle form submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `${Config.backendUrl}/api/products/update/${id}`
      : `${Config.backendUrl}/api/products/add`;

    try {
      const res = await fetch(endpoint, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.status) {
        toast.success(`✅ Product ${isEditMode ? 'updated' : 'added'}!`);
        if (!isEditMode) {
          setProduct({ name: '', description: '', price: '', image: '', category: '', stock: '' });
          setPreviewImage('');
        } else {
          navigate('/admin/products');
        }
      } else {
        toast.error(data.message || '❌ Operation failed');
      }
    } catch (err) {
      toast.error('❌ Server error');
    }
  };

  // Handle delete
  const handleDelete = async () => {
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
        navigate('/admin/products');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('❌ Delete failed');
    }
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow">
        <h3 className="mb-4 text-center">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            className="mb-3"
            name="name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-3"
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-3"
            name="price"
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-3"
            name="image"
            placeholder="Image URL (https://...)"
            value={product.image}
            onChange={handleChange}
          />

          {previewImage && (
            <div className="text-center mb-3">
              <Image src={previewImage} fluid thumbnail style={{ maxHeight: '200px' }} />
            </div>
          )}

          <Form.Control
            className="mb-3"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-3"
            name="stock"
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
          />

          <Button type="submit" variant={isEditMode ? 'primary' : 'success'} className="w-100 mb-2">
            {isEditMode ? 'Update Product' : 'Add Product'}
          </Button>

          {isEditMode && (
            <Button variant="danger" className="w-100" onClick={handleDelete}>
              Delete Product
            </Button>
          )}
        </Form>
      </Card>
    </Container>
  );
}

export default AddProduct;
