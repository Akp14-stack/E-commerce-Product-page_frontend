import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../Style/Home.css'; 

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
          // Sirf top 8 products as "featured"
          const featured = data.products.slice(0, 8);
          setProducts(featured);
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
      <h2 className="mb-4 text-center">Featured Products</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : err ? (
        <Alert variant="danger">{err}</Alert>
      ) : (
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
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
                    ₹{product.price}
                  </Card.Text>
                  <div className="mt-auto">
                    <Link to={`/product/${product._id}`}>
                      <Button variant="primary" className="w-100">
                        View Product
                      </Button>
                    </Link>
                  </div>
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
