import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Config from '../Config/Config';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [role, setRole] = useState('user');
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();

		const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!name) return toast.warning('Name is required!');
		if (!email) return toast.warning('Email is required!');
		if (!mailRegex.test(email)) return toast.warning('Invalid email!');
		if (!password) return toast.warning('Password is required!');

		try {
			let response = await fetch(`${Config.backendUrl}/api/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ name, email, password, role }),
			});

			response = await response.json();

			if (response.status) {
				// ✅ Save userId (and token if available) in localStorage
				if (response.user && response.user._id) {
					localStorage.setItem("userId", response.user._id);
				}
				if (response.token) {
					localStorage.setItem("token", response.token);
				}
				localStorage.setItem("role", role);

				toast.success('Signup successful!');
				setTimeout(() => navigate('/profile'), 1000); // go to profile instead of login
			} else {
				toast.error(response.message || 'Signup failed');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Server error. Please try again later.');
		}
	};

	return (
		<>
			<Header />
			<Container
				fluid
				className="min-vh-100 d-flex align-items-center justify-content-center"
				style={{
					background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
				}}
			>
				<ToastContainer />
				<Row className="justify-content-center w-100">
					<Col xs={12} md={8} lg={5}>
						<Card className="shadow-lg rounded-4 border-0 p-2">
							<Card.Body className="p-4">
								<h2 className="text-center text-success fw-bold mb-4">Create Your Account</h2>
								<Form onSubmit={handleSignUp}>
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

									<Form.Group className="mb-3" controlId="formBasicName">
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter your name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="rounded-3"
										/>
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
										<Button variant="success" type="submit" className="rounded-3 fw-semibold">
											Sign Up
										</Button>
									</div>

									<div className="text-center mt-3">
										<span>Already have an account?</span>{' '}
										<Link to="/login" className="text-decoration-none fw-bold text-primary">
											Login
										</Link>
									</div>
								</Form>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default SignUp;
