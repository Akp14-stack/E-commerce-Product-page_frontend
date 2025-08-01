import React, { useEffect, useState } from 'react';

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:7000/api/orders/my-orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching user orders:', err);
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🧾 My Order History</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="card mb-4 shadow-sm" key={order._id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span className={`badge bg-${getBadgeColor(order.status)}`}>{order.status}</span>
            </div>

            <div className="card-body">
              <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
              <p><strong>Mobile:</strong> {order.mobile || 'N/A'}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              <h6 className="mt-3">🛍️ Items:</h6>
              <ul className="list-group">
                {order.items.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const getBadgeColor = (status) => {
  switch (status) {
    case 'Pending': return 'warning';
    case 'Processing': return 'info';
    case 'Shipped': return 'primary';
    case 'Delivered': return 'success';
    case 'Cancelled': return 'danger';
    default: return 'secondary';
  }
};

export default UserOrderHistory;
