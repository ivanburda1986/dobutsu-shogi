import { FC, useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { useLoginUser, useRequestPasswordReset } from "../api/firestore";
import { onRequestPasswordReset, validatePasswordInputLength } from "./LoginScreenService";
import { validateEmail } from "../RegisterScreen/RegisterScreenService";

export const LoginScreen: FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailValidity, setEmailValidity] = useState<boolean>(false);
  const [userDoesNotExist, setUserDoesNotExist] = useState<boolean>(false);
  const [startedEmailEntry, setStartedEmailEntry] = useState<boolean>(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passLengthValidity, setPassLengthValidity] = useState<boolean>(false);
  const [startedPassEntry, setStartedPassEntry] = useState<boolean>(false);
  const [wrongPasswordEntered, setWrongPasswordEntered] = useState<boolean>(false);
  const [passResetLinkSent, setPassResetLinkSent] = useState<boolean>(false);

  const [formValid, setFormValid] = useState<boolean>(false);
  const loginUser = useLoginUser;
  const requestPasswordReset = useRequestPasswordReset;

  useEffect(() => {
    if (emailValidity && passLengthValidity) {
      return setFormValid(true);
    }
    return setFormValid(false);
  }, [emailValidity, passLengthValidity]);

  const onLogin = () => {
    loginUser({ email: emailRef.current!.value, password: passwordRef.current!.value, loginUserCb: { forwardError } });
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
          <Form className="transparentContainer border-rounded-lightblue p-3">
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
                  setEmailValidity(validateEmail(emailRef.current?.value));
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
                  validatePasswordInputLength({ passwordRef, setPassLengthValidity });
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
          <Button variant="link" className="mx-auto" onClick={() => onRequestPasswordReset({ emailRef, requestPasswordReset, setPassResetLinkSent })}>
            Email password reset link
          </Button>
        )}
        {passResetLinkSent && <p className="text-center py-1">Check your mailbox!</p>}
      </Row>
    </Container>
  );
};
