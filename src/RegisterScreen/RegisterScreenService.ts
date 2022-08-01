import {RefObject} from 'react';
// RefObject<HTMLInputElement>
export const validatePasswordInputLength = (
    password: string | undefined
) => {
    if (password) {
        return password.length >= 6;
    }
    return false;
};

export const validateUsernameInputLength = (
    username: string | undefined
) => {
    if (username) {
        return username.length >= 2;
    }
    return false;
};


export const validatePasswordMatch = (
    password: string | undefined,
    confirmPassword: string | undefined) => {
    if (password && confirmPassword) {
        return password === confirmPassword;
    }
    return false;
};

export const validateEmail = (email: string | undefined) => {
    const validationRegex = /\S+@\S+\.\S+/;
    if (email === undefined) {
        return false;
    }
    return validationRegex.test(email);
};
