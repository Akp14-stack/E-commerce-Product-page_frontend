import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Contact() {
  return (
    <Container className="py-5">
      <h1 className="mb-5 text-primary text-center">Contact Us</h1>
      <Row className="g-4">
        {/* Contact Info Card */}
        <Col md={5}>
          <Card className="shadow-sm p-4 h-100">
            <Card.Body>
              <Card.Title className="mb-4">Get in Touch</Card.Title>
              <p><strong>Email:</strong> ayanpathak81@gmail.com</p>
              <p><strong>Phone:</strong> +91 98833 37593</p>
              <p><strong>Address:</strong> India</p>

              <h6 className="mt-4 mb-2">Follow Us</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-primary fs-5"><FaFacebookF /></a>
                <a href="#" className="text-info fs-5"><FaTwitter /></a>
                <a href="#" className="text-danger fs-5"><FaInstagram /></a>
                <a href="#" className="text-primary fs-5"><FaLinkedinIn /></a>
              </div>

              <div className="mt-4">
                <iframe
                  title="location"
                  src="https://maps.google.com/maps?q=India&t=&z=5&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Contact Form Card */}
        <Col md={7}>
          <Card className="shadow-sm p-4 h-100">
            <Card.Body>
              <Card.Title className="mb-4">Send Us a Message</Card.Title>
              <Form>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Your name here" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Your email here" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Type your message..." />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Send Message
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        a:hover {
          transform: scale(1.2);
          transition: 0.3s;
        }
      `}</style>
    </Container>
  );
}

export default Contact;
