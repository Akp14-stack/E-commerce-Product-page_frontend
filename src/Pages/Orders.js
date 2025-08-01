import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Form, Pagination } from 'react-bootstrap';
import { getToken } from '../Utils/Auth';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (currentPage = 1) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:7000/api/orders/all?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.status) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
      } else {
        setErrorMsg(data.message || 'Failed to load orders');
      }
    } catch (err) {
      setErrorMsg('Something went wrong while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:7000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.status) {
        setSuccessMsg('✅ Order status updated successfully');
        fetchOrders(page); // refresh current page
      } else {
        setErrorMsg(data.message || '❌ Failed to update status');
      }
    } catch (err) {
      setErrorMsg('❌ Error updating order status');
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const renderPagination = () => {
    const pages = [];
    for (let p = 1; p <= totalPages; p++) {
      pages.push(
        <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
          {p}
        </Pagination.Item>
      );
    }
    return <Pagination>{pages}</Pagination>;
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📦 Admin: All Orders</h2>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>User Info</th>
                <th>Items</th>
                <th>Total</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>{order.user?.name}</strong><br />
                    {order.user?.email}<br />
                    📱 {order.mobile || 'N/A'}
                  </td>
                  <td>
                    <ul className="mb-0">
                      {order.items.map((item) => (
                        <li key={item.productId}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.total}</td>
                  <td>{order.address}</td>
                  <td>
                    <span className={`badge bg-${getBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <Form.Select
                      defaultValue={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">{renderPagination()}</div>
        </>
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

export default AdminOrders;
