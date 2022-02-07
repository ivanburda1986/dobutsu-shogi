import React, { useContext, useRef } from "react";
import { NavLink } from "react-router-dom";

import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

import { AppContext } from "../context/AppContext";
import { validateEmail } from "../RegisterScreen/validateEmail";
import { useLoginUser, useRequestPasswordReset } from "../api/firestore";

import styles from "./LoginScreen.module.css";
import sharedStyles from "../sharedStyles.module.css";

export const LoginScreen: React.FC = () => {
  const appContext = useContext(AppContext);

  const emailRef = useRef<HTMLInputElement>(null);
  const [emailInput, setEmailInput] = React.useState<string>("");
  const [emailValidity, setEmailValidity] = React.useState<boolean>(false);
  const [userDoesNotExist, setUserDoesNotExist] = React.useState<boolean>(false);
  const [startedEmailEntry, setStartedEmailEntry] = React.useState<boolean>(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordInput, setPasswordInput] = React.useState<string>("");
  const [passLengthValidity, setPassLengthValidity] = React.useState<boolean>(false);
  const [startedPassEntry, setStartedPassEntry] = React.useState<boolean>(false);
  const [wrongPasswordEntered, setWrongPasswordEntered] = React.useState<boolean>(false);
  const [passResetLinkSent, setPassResetLinkSent] = React.useState<boolean>(false);

  const [formValid, setFormValid] = React.useState<boolean>(false);
  const loginUser = useLoginUser;
  const requestPasswordReset = useRequestPasswordReset;

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
    loginUser({ email: emailRef.current!.value, password: passwordRef.current!.value, loginUserCb: { forwardError } });
  };

  const onRequestPasswordReset = () => {
    if (emailRef.current) {
      requestPasswordReset({ email: emailRef.current?.value });
      setPassResetLinkSent(true);
      setTimeout(() => {
        setPassResetLinkSent(false);
      }, 3000);
    }
  };

  const forwardError = (error: string) => {
    if (error === "Firebase: Error (auth/user-not-found).") {
      setUserDoesNotExist(true);
      setTimeout(() => {
        setUserDoesNotExist(false);
      }, 5000);
    }

    if (error === "Firebase: Error (auth/wrong-password).") {
      setWrongPasswordEntered(true);
      setTimeout(() => {
        setWrongPasswordEntered(false);
      }, 3000);
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
                autoComplete="username"
                onChange={() => {
                  setEmailInput(emailRef.current!.value);
                  setStartedEmailEntry(true);
                  validateEmailInput();
                }}
              />
              {startedEmailEntry && !emailValidity && <Form.Text className="text-danger ">Incomplete email address.</Form.Text>}
              {userDoesNotExist && emailValidity && <Form.Text className="text-danger ">The user does not exist. Make sure it is correct or register instead.</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={passwordRef}
                value={passwordInput}
                autoComplete="current-password"
                onChange={() => {
                  setPasswordInput(passwordRef.current!.value);
                  validatePasswordInputLength();
                  setStartedPassEntry(true);
                }}
              />
              {startedPassEntry && !passLengthValidity && <Form.Text className="text-danger">Enter your password.</Form.Text>}
              {wrongPasswordEntered && passLengthValidity && <Form.Text className="text-danger">Wrong password. </Form.Text>}
            </Form.Group>

            <Button variant="primary" type="button" disabled={!formValid} onClick={() => onLogin()}>
              Login
            </Button>
          </Form>
        </Col>
        {emailValidity && !passResetLinkSent && (
          <Button variant="link" className="mx-auto" onClick={() => onRequestPasswordReset()}>
            Email password reset link
          </Button>
        )}
        {passResetLinkSent && <p className="text-center py-1">Check your mailbox!</p>}
      </Row>
    </Container>
  );
};
