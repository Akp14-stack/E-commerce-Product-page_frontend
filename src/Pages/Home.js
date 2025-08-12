import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Spinner,
  Alert,
  Carousel
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../Style/Home.css';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:7000/api/products/all');
        const data = await res.json();

        if (res.ok) {
          const featured = (data.products || []).filter(p => p.featured === true);
          setFeaturedProducts(featured);
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
    <>
      {/* Hero Carousel */}
      <Container fluid className="p-0">
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : err ? (
          <Alert variant="danger" className="m-3">{err}</Alert>
        ) : featuredProducts.length > 0 ? (
          <Carousel fade interval={3000} pause={false}>
            {featuredProducts.slice(0, 5).map((product) => (
              <Carousel.Item key={product._id}>
                <div className="carousel-img-wrapper">
                  <img
                    className="d-block w-100 img-fluid carousel-img"
                    src={product.image || 'https://via.placeholder.com/1200x400'}
                    alt={product.name}
                  />
                  <div className="carousel-gradient"></div>
                </div>
                <Carousel.Caption className="custom-carousel-caption">
                  <h3>{product.name}</h3>
                  <p>Special Offer - ₹{product.price}</p>
                  <Link to={`/product/${product._id}`}>
                    <Button variant="light" className="shadow-sm">Shop Now</Button>
                  </Link>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p className="text-center py-4">No featured products available</p>
        )}
      </Container>

      {/* Featured Products */}
      <Container className="mt-5">
        <h2 className="mb-4 text-center section-title">Featured Products</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : err ? (
          <Alert variant="danger">{err}</Alert>
        ) : featuredProducts.length > 0 ? (
          <Row className="g-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 border-0 product-card shadow-hover">
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
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No featured products available</p>
        )}
      </Container>
    </>
  );
}

export default Home;
