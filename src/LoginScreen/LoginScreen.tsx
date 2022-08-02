import React, {FC, useEffect, useState, useRef} from "react";
import {NavLink} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

import {useLoginUser, useRequestPasswordReset} from "../api/firestore";
import {onRequestPasswordReset, validatePasswordInputLength} from "./LoginScreenService";
import {evaluateFormValidity} from "../RegisterScreen/RegisterScreenService";
import {validateEmail} from "../RegisterScreen/RegisterScreenService";

export const LoginScreen: FC = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const [emailInput, setEmailInput] = useState<string | undefined>("");
    const [isEnteredEmailValid, setIsEnteredEmailValid] = useState<boolean>(false);

    const [doesUserExist, setDoesUserExist] = useState<boolean>(false);
    const [isEnteringEmail, setIsEnteringEmail] = useState<boolean>(false);

    const passwordRef = useRef<HTMLInputElement>(null);
    const [passwordInput, setPasswordInput] = useState<string | undefined>("");
    const [isPasswordLengthValid, setIsPasswordLengthValid] = useState<boolean>(false);
    const [isEnteringPassword, setIsEnteringPassword] = useState<boolean>(false);
    const [isWrongPasswordEntered, setIsWrongPasswordEntered] = useState<boolean>(false);
    const [hasPasswordResetLinkBeenSent, setHasPasswordResetLinkBeenSent] = useState<boolean>(false);

    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const loginUser = useLoginUser;
    const requestPasswordReset = useRequestPasswordReset;


    useEffect(() => {
        setIsFormValid(evaluateFormValidity([isEnteredEmailValid, isPasswordLengthValid]));
    }, [isEnteredEmailValid, isPasswordLengthValid]);


    const forwardError = (error: string) => {
        if (error === "Firebase: Error (auth/user-not-found).") {
            setDoesUserExist(true);
            setTimeout(() => {
                setDoesUserExist(false);
            }, 5000);
        }

        if (error === "Firebase: Error (auth/wrong-password).") {
            setIsWrongPasswordEntered(true);
            setTimeout(() => {
                setIsWrongPasswordEntered(false);
            }, 3000);
        }
    };

    const onLogin = () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        if (email && password) {
            loginUser({email: email, password: password, loginUserCb: {forwardError}});
        }
    };
    // passwordRef: React.RefObject<HTMLInputElement>

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
                                    const email = emailRef.current?.value;
                                    setEmailInput(email);
                                    setIsEnteringEmail(true);
                                    setIsEnteredEmailValid(validateEmail(email));
                                }}
                            />
                            {isEnteringEmail && !isEnteredEmailValid &&
                                <Form.Text className="text-danger ">Incomplete email address.</Form.Text>}
                            {doesUserExist && isEnteredEmailValid &&
                                <Form.Text className="text-danger ">The user does not exist. Make sure it is correct or
                                    register
                                    instead.</Form.Text>}
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
                                    const password = passwordRef.current?.value;
                                    setPasswordInput(password);
                                    setIsPasswordLengthValid(validatePasswordInputLength(password));
                                    setIsEnteringPassword(true);
                                }}
                            />
                            {isEnteringPassword && !isPasswordLengthValid &&
                                <Form.Text className="text-danger">Enter your password.</Form.Text>}
                            {isWrongPasswordEntered && isPasswordLengthValid &&
                                <Form.Text className="text-danger">Wrong password. </Form.Text>}
                        </Form.Group>

                        <Button variant="primary" type="button" disabled={!isFormValid} onClick={() => onLogin()}>
                            Login
                        </Button>
                    </Form>
                </Col>
                {isEnteredEmailValid && !hasPasswordResetLinkBeenSent && (
                    <Button variant="link" className="mx-auto" onClick={() => {
                        const email = emailRef.current?.value;
                        onRequestPasswordReset({
                            email,
                            requestPasswordReset,
                            callback: setHasPasswordResetLinkBeenSent
                        });
                    }}>
                        Email password reset link
                    </Button>
                )}
                {hasPasswordResetLinkBeenSent && <p className="text-center py-1">Check your mailbox!</p>}
            </Row>
        </Container>
    );
};
