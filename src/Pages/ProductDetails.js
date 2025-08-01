import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import Config from '../Config/Config';
import { getCart, saveCart } from '../Utils/cartUtils';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${Config.backendUrl}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status) setProduct(data.product);
      });
  }, [id]);

  const handleAddToCart = () => {
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

  if (!product) return <div className="text-center py-5">Loading...</div>;

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <Image src={product.image || 'https://via.placeholder.com/300'} fluid />
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4>₹{product.price}</h4>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetails;
