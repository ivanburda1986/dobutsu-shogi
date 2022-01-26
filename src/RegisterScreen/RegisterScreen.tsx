import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import styles from "./RegisterScreen.module.css";

import { useRegisterUser } from "../api/firestore";
import { validateEmail } from "./validateEmail";

export const RegisterScreen: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailInput, setEmailInput] = React.useState<string>("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordInput, setPasswordInput] = React.useState<string>("");
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [confirmPasswordInput, setConfirmPasswordInput] = React.useState<string>("");
  const [emailValidity, setEmailValidity] = React.useState<boolean>(false);
  const [startedEmailEntry, setStartedEmailEntry] = React.useState<boolean>(false);
  const [passLengthValidity, setPassLengthValidity] = React.useState<boolean>(false);
  const [passMatchValidity, setPassMatchValidity] = React.useState<boolean>(false);
  const [startedPassEntry, setStartedPassEntry] = React.useState<boolean>(false);
  const [formValid, setFormValid] = React.useState<boolean>(false);
  const registerUser = useRegisterUser;

  React.useEffect(() => {
    if (emailValidity && passLengthValidity && passMatchValidity) {
      return setFormValid(true);
    }
    return setFormValid(false);
  }, [emailValidity, passLengthValidity, passMatchValidity]);

  const validateEmailInput = () => {
    setEmailValidity(validateEmail(emailRef.current?.value));
  };

  const validatePasswordInputLength = () => {
    if (passwordRef.current?.value) {
      if (passwordRef.current.value.length >= 6) {
        return setPassLengthValidity(true);
      }
      return setPassLengthValidity(false);
    }
    setPassLengthValidity(false);
  };

  const validatePasswordMatch = () => {
    if (passwordRef.current?.value && confirmPasswordRef.current?.value) {
      if (passwordRef.current?.value === confirmPasswordRef.current?.value) {
        return setPassMatchValidity(true);
      }
    }
    return setPassMatchValidity(false);
  };

  const resetForm = (userRegistrationSuccess: boolean) => {
    if (userRegistrationSuccess) {
      setEmailInput("");
      setPasswordInput("");
      setConfirmPasswordInput("");
    }
  };

  const onRegistration = () => {
    registerUser({ email: emailRef.current?.value, password: passwordRef.current?.value, callbackFunction: resetForm });
  };

  return (
    <Container fluid className="my-3">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <h2>Registration</h2>
          <div className="d-flex">
            <p className="me-1">Already registred?</p>
            <NavLink to="/login">Login</NavLink>
          </div>
          <Form id="registrationForm" className={`${styles.registerForm} p-3`}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="This will be your login"
                ref={emailRef}
                value={emailInput}
                onChange={() => {
                  setEmailInput(emailRef.current!.value);
                  setStartedEmailEntry(true);
                  validateEmailInput();
                }}
              />
              {startedEmailEntry && !emailValidity && <Form.Text className="text-danger">Invalid email address</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Min. 6 characters - not your mailbox pass"
                ref={passwordRef}
                value={passwordInput}
                onChange={() => {
                  setPasswordInput(passwordRef.current!.value);
                  setStartedPassEntry(true);
                  validatePasswordInputLength();
                  validatePasswordMatch();
                }}
              />
              {startedPassEntry && !passLengthValidity && <Form.Text className="text-danger">Your password is too short</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                ref={confirmPasswordRef}
                value={confirmPasswordInput}
                onChange={() => {
                  setConfirmPasswordInput(confirmPasswordRef.current!.value);
                  setStartedPassEntry(true);
                  validatePasswordMatch();
                }}
              />
              {startedPassEntry && !passMatchValidity && <Form.Text className="text-danger">The passwords do not match.</Form.Text>}
            </Form.Group>
            <Button variant="primary" type="button" disabled={!formValid} onClick={() => onRegistration()}>
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
