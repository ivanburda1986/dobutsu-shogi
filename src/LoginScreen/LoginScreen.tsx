import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import styles from "./LoginScreen.module.css";
import sharedStyles from "../sharedStyles.module.css";

export const LoginScreen: React.FC = () => {
  return (
    <Container fluid className="my-3">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <h2>Login</h2>
          <div className="d-flex flex-row justify-content-start">
            <p className="me-1">Not registered yet?</p>
            <NavLink to="/register">Register</NavLink>
          </div>
          <Form className={`${styles.loginForm} p-3`}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <div>
              <a href="#" className="small mb-2">
                Forgotten your password?
              </a>
            </div>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
