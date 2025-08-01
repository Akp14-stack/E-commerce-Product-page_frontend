import React, { useEffect, useState } from 'react';
import { getToken } from '../Utils/Auth';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
    const totalPrice = storedCart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(totalPrice);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (paymentInfo) => {
    const token = getToken();
    const formattedItems = cart.map((item) => ({
      productId: item.productId || item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const res = await axios.post(
        'http://localhost:7000/api/orders/place',
        {
          items: formattedItems,
          total,
          address,
          mobile,
          paymentMethod,
          ...paymentInfo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        localStorage.removeItem('cart');
        alert('Order placed successfully!');
        navigate('/');
      } else {
        setErrorMsg(res.data.message || 'Order placement failed.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setErrorMsg('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!address.trim()) {
      return setErrorMsg('Please enter a delivery address');
    }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) {
      return setErrorMsg('Please enter a valid 10-digit mobile number');
    }

    setErrorMsg('');
    setLoading(true);

    if (paymentMethod === 'cod') {
      await placeOrder({ paymentId: 'COD', razorpayOrderId: null });
    } else {
      try {
        const token = getToken();
        const res = await axios.post(
          'http://localhost:7000/api/payment/order',
          { amount: total * 100 }, // paise
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await loadRazorpayScript();
        if (!result) {
          alert('Failed to load Razorpay SDK');
          return;
        }

        const options = {
          key: 'your_razorpay_key_id',
          amount: res.data.order.amount,
          currency: 'INR',
          name: 'My E-Commerce',
          description: 'Order Payment',
          order_id: res.data.order.id,
          handler: async function (response) {
            await placeOrder({
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: mobile,
          },
          theme: {
            color: '#673AB7',
          },
          method: {
            netbanking: true,
            card: true,
            upi: true,
            wallet: true,
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error('Error during Razorpay flow:', err);
        setErrorMsg('Something went wrong. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                {item.name} × {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>

          <h4>Total: ₹{total}</h4>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Pay with Razorpay / Wallets"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                inline
                type="radio"
                label="Cash on Delivery"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
          </Form.Group>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Button variant="primary" onClick={handleOrder} disabled={loading}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : paymentMethod === 'razorpay' ? (
              'Pay Now'
            ) : (
              'Place Order (COD)'
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default Checkout;
