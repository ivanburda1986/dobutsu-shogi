import {FC, useContext, useEffect, useRef, useState} from "react";
import {NavLink} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

import {AppContext} from "../context/AppContext";

import {useRegisterUser} from "../api/firestore";
import {
    validateEmail,
    validatePasswordInputLength,
    validatePasswordMatch,
    validateUsernameInputLength
} from "./RegisterScreenService";

export const RegisterScreen: FC = () => {
    const {setUserData} = useContext(AppContext);

    const emailRef = useRef<HTMLInputElement>(null);
    const [emailInput, setEmailInput] = useState<string>("");
    const [isEnteredEmailValid, setIsEnteredEmailValid] = useState<boolean>(false);
    const [isEnteringEmail, setIsEnteringEmail] = useState<boolean>(false);
    const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState<boolean>(false);

    const usernameRef = useRef<HTMLInputElement>(null);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [isEnteredUsernameValid, setIsEnteredUsernameValid] = useState<boolean>(false);
    const [isEnteringUsername, setIsEnteringUsername] = useState<boolean>(false);

    const passwordRef = useRef<HTMLInputElement>(null);
    const [passwordInput, setPasswordInput] = useState<string>("");
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);
    const [passwordConfirmationInput, setPasswordConfirmationInput] = useState<string>("");
    const [isPasswordLengthValid, setIsPasswordLengthValid] = useState<boolean>(false);
    const [isPasswordConfirmationMatching, setIsPasswordConfirmationMatching] = useState<boolean>(false);
    const [isEnteringPassword, setIsEnteringPassword] = useState<boolean>(false);

    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const registerUser = useRegisterUser;

    useEffect(() => {
        if (isEnteredEmailValid && isEnteredUsernameValid && isPasswordLengthValid && isPasswordConfirmationMatching) {
            return setIsFormValid(true);
        }
        return setIsFormValid(false);
    }, [isEnteredEmailValid, isEnteredUsernameValid, isPasswordLengthValid, isPasswordConfirmationMatching]);

    const onRegistration = () => {
        if (emailRef.current && usernameRef.current && passwordRef.current) {
            registerUser({
                email: emailRef.current.value,
                username: usernameRef.current.value,
                password: passwordRef.current.value,
                registerUserCb: {onError: forwardError, onSuccess: setUserData}
            });
        }
    };

    const forwardError = (error: string) => {
        if (error === "Firebase: Error (auth/email-already-in-use).") {
            setIsEmailAlreadyUsed(true);
            setTimeout(() => {
                setIsEmailAlreadyUsed(false);
            }, 3000);
        }
    };

    return (
        <Container fluid className="my-3">
            <Row className="justify-content-center">
                <Col md={8} lg={5}>
                    <h2>Registration</h2>
                    <div className="d-flex">
                        <p className="me-1">Already registered?</p>
                        <NavLink to="/login">Login</NavLink>
                    </div>
                    <Form id="registrationForm" className="border-rounded-lightblue transparentContainer p-3">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="This will be your login"
                                ref={emailRef}
                                value={emailInput}
                                autoComplete="email"
                                onChange={() => {
                                    setEmailInput(emailRef.current!.value);
                                    setIsEnteringEmail(true);
                                    setIsEnteredEmailValid(validateEmail(emailRef.current?.value));
                                }}
                            />
                            {isEnteringEmail && !isEnteredEmailValid &&
                                <Form.Text className="text-danger">Invalid email address</Form.Text>}
                            {isEmailAlreadyUsed && <Form.Text className="text-danger">Email already used. Try to login
                                instead.</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Min. 6 characters - not your mailbox pass"
                                ref={passwordRef}
                                value={passwordInput}
                                autoComplete="new-password"
                                onChange={() => {
                                    const password = passwordRef.current?.value;
                                    setPasswordInput(passwordRef.current!.value);
                                    setIsEnteringPassword(true);
                                    setIsPasswordLengthValid(validatePasswordInputLength(password));
                                    validatePasswordMatch(
                                        passwordRef,
                                        passwordConfirmationRef,
                                        setIsPasswordConfirmationMatching
                                    );
                                }}
                            />
                            {isEnteringPassword && !isPasswordLengthValid &&
                                <Form.Text className="text-danger">At least 6 characters please.</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                ref={passwordConfirmationRef}
                                value={passwordConfirmationInput}
                                autoComplete="new-password"
                                onChange={() => {
                                    setPasswordConfirmationInput(passwordConfirmationRef.current!.value);
                                    setIsEnteringPassword(true);
                                    validatePasswordMatch(
                                        passwordRef,
                                        passwordConfirmationRef,
                                        setIsPasswordConfirmationMatching
                                    );
                                }}
                            />
                            {isEnteringPassword && !isPasswordConfirmationMatching &&
                                <Form.Text className="text-danger">Passwords do not match.</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Min. 2 characters"
                                ref={usernameRef}
                                value={usernameInput}
                                autoComplete="username"
                                onChange={() => {
                                    setUsernameInput(usernameRef.current!.value);
                                    setIsEnteringUsername(true);
                                    validateUsernameInputLength(usernameRef,
                                        setIsEnteredUsernameValid);
                                }}
                            />
                            {isEnteringUsername && !isEnteredUsernameValid &&
                                <Form.Text className="text-danger">Choose a longer username</Form.Text>}
                        </Form.Group>

                        <Button variant="primary" type="button" disabled={!isFormValid}
                                onClick={() => onRegistration()}>
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
