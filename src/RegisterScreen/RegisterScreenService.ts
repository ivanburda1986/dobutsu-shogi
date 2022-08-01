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
    usernameRef: RefObject<HTMLInputElement>,
    setIsEnteredUsernameValid: (newValue: boolean) => void
) => {
    if (usernameRef.current) {
        if (usernameRef.current.value.length >= 2) {
            return setIsEnteredUsernameValid(true);
        }
        return setIsEnteredUsernameValid(false);
    }
    setIsEnteredUsernameValid(false);
};


export const validatePasswordMatch = (
    passwordRef: RefObject<HTMLInputElement>,
    confirmPasswordRef: RefObject<HTMLInputElement>,
    setIsPasswordConfirmationMatching: (newValue: boolean) => void) => {
    if (passwordRef.current && confirmPasswordRef.current) {
        if (passwordRef.current?.value === confirmPasswordRef.current?.value) {
            return setIsPasswordConfirmationMatching(true);
        }
    }
    return setIsPasswordConfirmationMatching(false);
};

export const validateEmail = (email: string | undefined) => {
    const validationRegex = /\S+@\S+\.\S+/;
    if (email === undefined) {
        return false;
    }
    return validationRegex.test(email);
};
