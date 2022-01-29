import React, { useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { AppContext } from "../context/AppContext";
import { validateEmail } from "../RegisterScreen/validateEmail";
import { useLoginUser } from "../api/firestore";

import styles from "./LoginScreen.module.css";
import sharedStyles from "../sharedStyles.module.css";

export const LoginScreen: React.FC = () => {
  const appContext = useContext(AppContext);
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailInput, setEmailInput] = React.useState<string>("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordInput, setPasswordInput] = React.useState<string>("");
  const [passLengthValidity, setPassLengthValidity] = React.useState<boolean>(false);
  const [emailValidity, setEmailValidity] = React.useState<boolean>(false);
  const [startedEmailEntry, setStartedEmailEntry] = React.useState<boolean>(false);
  const [startedPassEntry, setStartedPassEntry] = React.useState<boolean>(false);
  const [formValid, setFormValid] = React.useState<boolean>(false);
  const loginUser = useLoginUser;

  React.useEffect(() => {
    if (emailValidity && passLengthValidity) {
      return setFormValid(true);
    }
    return setFormValid(false);
  }, [emailValidity, passLengthValidity]);

  const validateEmailInput = () => {
    setEmailValidity(validateEmail(emailRef.current?.value));
  };
  const validatePasswordInputLength = () => {
    if (passwordRef.current?.value) {
      if (passwordRef.current.value.length >= 1) {
        return setPassLengthValidity(true);
      }
      return setPassLengthValidity(false);
    }
    setPassLengthValidity(false);
  };

  const onLogin = () => {
    loginUser({ email: emailRef.current?.value, password: passwordRef.current?.value, loginUserCb: { resetForm } });
  };

  const resetForm = (userLoginSuccess: boolean) => {
    if (userLoginSuccess) {
      setEmailInput("");
      setPasswordInput("");
    }
  };

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
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={emailRef}
                value={emailInput}
                onChange={() => {
                  setEmailInput(emailRef.current!.value);
                  setStartedEmailEntry(true);
                  validateEmailInput();
                }}
              />
              {startedEmailEntry && !emailValidity && <Form.Text className="text-danger">Invalid format of email address</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={passwordRef}
                value={passwordInput}
                onChange={() => {
                  setPasswordInput(passwordRef.current!.value);
                  validatePasswordInputLength();
                  setStartedPassEntry(true);
                }}
              />
              {startedPassEntry && !passLengthValidity && <Form.Text className="text-danger">Password not entered</Form.Text>}
            </Form.Group>
            <div>
              <a href="#" className="small">
                Forgotten password?
              </a>
            </div>
            <Button variant="primary" type="button" disabled={!formValid} onClick={() => onLogin()}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
