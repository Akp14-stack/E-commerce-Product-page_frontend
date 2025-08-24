import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Config from '../Config/Config';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [role, setRole] = useState('user');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) return toast.warning('Email is required!');
		if (!mailRegex.test(email)) return toast.warning('Email is not valid!');
		if (!password) return toast.warning('Password is required!');

		try {
			let response = await fetch(`${Config.backendUrl}/api/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ email, password, role }),
			});

			response = await response.json();

			if (response.status) {
				toast.success('Login successful!');

				// ✅ Save to localStorage
				if (response.token) {
					localStorage.setItem("token", response.token);
				}
				if (response.data && response.data._id) {
					localStorage.setItem("userId", response.data._id);
				} else if (response.user && response.user._id) {
					localStorage.setItem("userId", response.user._id);
				}
				localStorage.setItem("role", role);

				// ✅ Redirect
				if (role === "admin") {
					navigate("/admin/add-product");
				} else {
					navigate("/");
				}
			} else {
				toast.error(response.message || "Login failed");
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Server error. Please try again later.');
		}
	};

	return (
		<>
			<Header />
			<Container fluid className="login-bg d-flex align-items-center justify-content-center min-vh-100">
				<ToastContainer />
				<Row className="justify-content-center w-100">
					<Col xs={12} md={8} lg={5}>
						<Card className="shadow-lg rounded-4 border-0 p-2 bg-white bg-opacity-75 backdrop-blur">
							<Card.Body className="p-4">
								<h2 className="text-center text-primary fw-bold mb-4">Login to Your Account</h2>
								<Form onSubmit={handleLogin}>
									<Form.Group className="mb-3" controlId="formBasicRole">
										<Form.Label>Select Role</Form.Label>
										<Form.Select
											value={role}
											onChange={(e) => setRole(e.target.value)}
											className="rounded-3"
										>
											<option value="user">User</option>
											<option value="admin">Admin</option>
										</Form.Select>
									</Form.Group>

									<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Email address</Form.Label>
										<Form.Control
											type="email"
											placeholder="Enter email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="rounded-3"
										/>
									</Form.Group>

									<Form.Group className="mb-4" controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<div className="position-relative">
											<Form.Control
												type={showPassword ? 'text' : 'password'}
												placeholder="Enter password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className="rounded-3 pe-5"
											/>
											<span
												onClick={() => setShowPassword(!showPassword)}
												className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
												style={{ cursor: 'pointer' }}
											>
												{showPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
											</span>
										</div>
									</Form.Group>

									<div className="d-grid mb-3">
										<Button variant="primary" type="submit" className="rounded-3 fw-semibold">
											Login
										</Button>
									</div>

									<div className="text-center mt-3">
										<span>Don't have an account?</span>{' '}
										<Link to="/sign-up" className="text-decoration-none fw-bold text-success">
											Sign Up
										</Link>
									</div>
								</Form>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>

			<style>{`
				.login-bg {
					background: linear-gradient(to right, #74ebd5, #ACB6E5);
				}
				.backdrop-blur {
					backdrop-filter: blur(8px);
				}
			`}</style>
		</>
	);
}

export default Login;
