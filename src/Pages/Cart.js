import React, { useEffect, useState } from 'react';
import { getCart, saveCart } from '../Utils/cartUtils';
import { Button, Container, Row, Col, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    saveCart(updated);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const goToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item._id} className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      fluid
                      rounded
                    />
                  </Col>
                  <Col md={4}>
                    <h5>{item.name}</h5>
                    <p>₹{item.price}</p>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center">
                      <Button
                        onClick={() => updateQuantity(item._id, -1)}
                        disabled={item.quantity <= 1}
                        size="sm"
                        variant="outline-secondary"
                      >
                        −
                      </Button>
                      <span className="mx-3">{item.quantity}</span>
                      <Button
                        onClick={() => updateQuantity(item._id, 1)}
                        size="sm"
                        variant="outline-secondary"
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                  <Col md={2}>
                    <strong>₹{item.quantity * item.price}</strong>
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          <h4 className="text-end">Total: ₹{totalPrice}</h4>
          <div className="text-end">
            <Button onClick={goToCheckout} variant="success">
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
