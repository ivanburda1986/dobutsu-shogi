import {validateEmail, validatePasswordInputLength, validateUsernameInputLength} from "../RegisterScreenService";

describe('RegisterScreenService', () => {
    describe('validatePasswordInputLength', () => {
        it('returns true when password has at least 6 characters long', () => {
            const password = "123456";

            const isValid = validatePasswordInputLength(password);

            expect(isValid).toBe(true);
        });

        it('returns false when password is shorter than 6 characters', () => {
            const password = "12345";

            const isValid = validatePasswordInputLength(password);

            expect(isValid).toBe(false);
        });

        it('returns false when password is not provided', () => {
            const password = undefined;

            const isValid = validatePasswordInputLength(password);

            expect(isValid).toBe(false);
        });
    });

    describe('validateUsernameInputLength', () => {
        it('return true when username has at least 2 characters', () => {
            const username = "ab";

            const isValid = validateUsernameInputLength(username);

            expect(isValid).toBe(true);
        });

        it('return false when username has fewer than 2 characters', () => {
            const username = "a";

            const isValid = validateUsernameInputLength(username);

            expect(isValid).toBe(false);
        });

        it('return true when username is not provided', () => {
            const username = undefined;

            const isValid = validateUsernameInputLength(username);

            expect(isValid).toBe(false);
        });
    });

    describe('validateEmail', () => {
        it('return true when email address is valid', () => {
            const email = "johndoe@gmail.com";

            const isValid = validateEmail(email);

            expect(isValid).toBe(true);
        });

        it('return false when email address is invalid', () => {
            const email = "johndoe@gmail.";

            const isValid = validateEmail(email);

            expect(isValid).toBe(false);
        });

        it('return false when email address is not provided', () => {
            const email = undefined;

            const isValid = validateEmail(email);

            expect(isValid).toBe(false);
        });
    });
});
