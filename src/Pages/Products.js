import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Config from '../Config/Config';
import { getCart, saveCart } from '../Utils/cartUtils';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${Config.backendUrl}/api/products/all`)
      .then(res => res.json())
      .then(data => {
        if (data.status) setProducts(data.products);
      });
  }, []);

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
    <Container className="py-5">
      <Row>
        {products.map((product) => (
          <Col md={4} key={product._id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={product.image || 'https://via.placeholder.com/150'} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text><strong>₹{product.price}</strong></Card.Text>
                <Button variant="primary" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
