import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom'; // 👈 Add this

function Footer() {
	return (
		<footer className="bg-dark text-light py-4 mt-auto">
			<Container>
				<Row>
					<Col md={4}>
						<h5>About Us</h5>
						<p>
							This is an E-commerce website. We offer a wide range of products at competitive prices.
						</p>
					</Col>
					<Col md={4}>
						<h5>Quick Links</h5>
						<ul className="list-unstyled">
							<li><Link to="/home" className="text-light text-decoration-none">Home</Link></li>
							<li><Link to="/about" className="text-light text-decoration-none">About</Link></li>
							<li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
						</ul>
					</Col>
					<Col md={4}>
						<h5>Contact Info</h5>
						<p>Email: ayanpathak@gmail.com</p>
						<p>Phone: +91-9883327593</p>
					</Col>
				</Row>
				<hr className="border-light" />
				<div className="text-center">
					&copy; {new Date().getFullYear()} Your Company. All rights reserved.
				</div>
			</Container>
		</footer>
	);
}

export default Footer;
