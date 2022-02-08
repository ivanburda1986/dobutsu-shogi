import { FC, useEffect, useState, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { AppContext } from "../context/AppContext";
import { useRegisterUser } from "../api/firestore";
import { validateEmail } from "./validateEmail";
import { ProvidedContextInterface } from "../App";

export const RegisterScreen: FC = () => {
  const appContext = useContext(AppContext);
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailValidity, setEmailValidity] = useState<boolean>(false);
  const [startedEmailEntry, setStartedEmailEntry] = useState<boolean>(false);
  const [emailAlreadyUsed, setEmailAlreadyUsed] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [usernameValidity, setUsernameValidity] = useState<boolean>(false);
  const [startedUsernameEntry, setStartedUsernameEntry] = useState<boolean>(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
  const [passLengthValidity, setPassLengthValidity] = useState<boolean>(false);
  const [passMatchValidity, setPassMatchValidity] = useState<boolean>(false);
  const [startedPassEntry, setStartedPassEntry] = useState<boolean>(false);

  const [formValid, setFormValid] = useState<boolean>(false);
  const registerUser = useRegisterUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (emailValidity && usernameValidity && passLengthValidity && passMatchValidity) {
      return setFormValid(true);
    }
    return setFormValid(false);
  }, [emailValidity, usernameValidity, passLengthValidity, passMatchValidity]);

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

  const validateUsernameInputLength = () => {
    if (usernameRef.current?.value) {
      if (usernameRef.current.value.length >= 2) {
        return setUsernameValidity(true);
      }
      return setUsernameValidity(false);
    }
    setUsernameValidity(false);
  };

  const validatePasswordMatch = () => {
    if (passwordRef.current?.value && confirmPasswordRef.current?.value) {
      if (passwordRef.current?.value === confirmPasswordRef.current?.value) {
        return setPassMatchValidity(true);
      }
    }
    return setPassMatchValidity(false);
  };

  const onRegistration = () => {
    registerUser({ email: emailRef.current!.value, username: usernameRef.current!.value, password: passwordRef.current!.value, registerUserCb: { forwardError, updateUserData: appContext.setUserData } });
  };

  const forwardError = (error: string) => {
    if (error === "Firebase: Error (auth/email-already-in-use).") {
      setEmailAlreadyUsed(true);
      setTimeout(() => {
        setEmailAlreadyUsed(false);
      }, 3000);
    }
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
          <Form id="registrationForm" className="border-rounded-lightblue transparentContainer p-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="This will be your login"
                ref={emailRef}
                value={emailInput}
                autoComplete="email"
                onChange={() => {
                  setEmailInput(emailRef.current!.value);
                  setStartedEmailEntry(true);
                  validateEmailInput();
                }}
              />
              {startedEmailEntry && !emailValidity && <Form.Text className="text-danger">Invalid email address</Form.Text>}
              {emailAlreadyUsed && <Form.Text className="text-danger">Email already used. Try to login instead.</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Min. 2 characters"
                ref={usernameRef}
                value={usernameInput}
                autoComplete="username"
                onChange={() => {
                  setUsernameInput(usernameRef.current!.value);
                  setStartedUsernameEntry(true);
                  validateUsernameInputLength();
                }}
              />
              {startedUsernameEntry && !usernameValidity && <Form.Text className="text-danger">Choose a longer username</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Min. 6 characters - not your mailbox pass"
                ref={passwordRef}
                value={passwordInput}
                autoComplete="new-password"
                onChange={() => {
                  setPasswordInput(passwordRef.current!.value);
                  setStartedPassEntry(true);
                  validatePasswordInputLength();
                  validatePasswordMatch();
                }}
              />
              {startedPassEntry && !passLengthValidity && <Form.Text className="text-danger">Your password is too short</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                ref={confirmPasswordRef}
                value={confirmPasswordInput}
                autoComplete="new-password"
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
