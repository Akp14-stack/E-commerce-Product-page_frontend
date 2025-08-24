import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function About() {
  return (
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Image Section */}
        <Col md={6} className="mb-4 mb-md-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
            alt="About Us"
            fluid
            rounded
          />
        </Col>

        {/* Text Section */}
        <Col md={6}>
          <h1 className="mb-4 text-primary">About Us</h1>
          <p className="mb-3">
            Welcome to <strong>ShopEase</strong> – your ultimate online destination for 
            amazing products and a seamless shopping experience! We are passionate about 
            bringing you high-quality items that cater to your lifestyle and needs.
          </p>
          <p className="mb-3">
            Our mission is simple: to make online shopping easy, enjoyable, and affordable 
            for everyone. From trendy fashion to essential gadgets, we handpick products 
            that inspire and delight.
          </p>
          <p className="mb-4">
            Customer satisfaction is our top priority. We believe in providing fast delivery, 
            excellent service, and a trustworthy platform you can rely on.
          </p>
          <Button as={Link} to="/products" variant="primary" size="lg">
            Shop Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
