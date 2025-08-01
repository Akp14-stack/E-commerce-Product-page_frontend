import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:7000/api/products/all');
        const data = await res.json();

        if (res.ok) {
          setProducts(data.products); // assuming API sends { products: [...] }
        } else {
          setErr(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        setErr('Something went wrong while loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Welcome to the Home Page</h2>
      <h4 className="mb-3">All Products</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : err ? (
        <Alert variant="danger">{err}</Alert>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>₹{product.price}</Card.Text>
                  <Link to={`/product/${product._id}`}>
                    <Button variant="primary">View Product</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Home;
