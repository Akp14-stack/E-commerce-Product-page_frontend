import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Accordion } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Config from '../Config/Config';
import { getCart, saveCart } from '../Utils/cartUtils';
import '../Style/Product.css';

function Products({ externalFilteredProducts, setExternalFilteredProducts }) { // ✅ CHANGE: props added
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Fetch products
  useEffect(() => {
    fetch(`${Config.backendUrl}/api/products/all`)
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          setProducts(data.products);
          setFilteredProducts(data.products);
          if (setExternalFilteredProducts) { // ✅ CHANGE
            setExternalFilteredProducts(data.products);
          }

          const uniqueCategories = [
            ...new Set(data.products.map(p => p.category).filter(Boolean))
          ];
          setCategories(uniqueCategories);

          const prices = data.products.map(p => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
          setMaxPrice(max);
        }
      });
  }, []);

  // Apply filters (category, price, search)
  useEffect(() => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (searchQuery) {
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery)
      );
    }

    setFilteredProducts(filtered);
    if (setExternalFilteredProducts) { // ✅ CHANGE
      setExternalFilteredProducts(filtered);
    }
  }, [category, priceRange, products, searchQuery]);

  // ✅ CHANGE: If external filter from Header updates, sync here
  useEffect(() => {
    if (externalFilteredProducts && externalFilteredProducts.length) {
      setFilteredProducts(externalFilteredProducts);
    }
  }, [externalFilteredProducts]);

  const handleAddToCart = (product) => {
    let cart = getCart();
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(`${product.name} added to cart!`);
  };

  return (
    <Container className="py-4">
      {/* Filter Above Products */}
      <Row className="mb-3">
        <Col xs={12} md={4} lg={3}>
          <Accordion defaultActiveKey="0" className="shadow-sm small-filter">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filter Products</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Category</strong></Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    size="sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>
                    <strong>Price Range:</strong> ₹{priceRange[0]} - ₹{priceRange[1]}
                  </Form.Label>
                  <div className="price-slider">
                    <Form.Range
                      min={0}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                    <Form.Range
                      min={0}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                  </div>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* Products List */}
      <Row className="g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col md={4} sm={6} xs={12} key={product._id}>
              <Card className="h-100 shadow-sm border-0 product-card">
                <div className="img-container">
                  <Card.Img
                    variant="top"
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate" title={product.name}>
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-muted mb-2">
                    {product.description}
                  </Card.Text>
                  <Card.Text><strong>₹{product.price}</strong></Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(product)}
                      className="w-100"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No products found matching your search.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Products;
