import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import styles from "./RegisterScreen.module.css";

import { useRegisterUser } from "../api/firestore";

export const RegisterScreen: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const registerUser = useRegisterUser;

  return (
    <Container fluid className="my-3">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <h2>Registration</h2>
          <div className="d-flex">
            <p className="me-1">Already registred?</p>
            <NavLink to="/login">Login</NavLink>
          </div>
          <Form className={`${styles.registerForm} p-3`}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
              <Form.Text className="text-muted">This will be your login.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" ref={passwordRef} />
              <Form.Text className="text-muted">Don't use your mailbox password.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" />
            </Form.Group>
            <Button variant="primary" type="button" onClick={() => registerUser({ email: emailRef.current?.value, password: passwordRef.current?.value })}>
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};