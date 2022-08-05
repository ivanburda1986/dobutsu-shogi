import {validatePasswordInputLength} from '../LoginScreenService';

describe('loginScreenService', () => {
    describe('validatePasswordInputLength', () => {
        it('returns true when password has at least 1 character', () => {
            const password = "123";

            const isValid = validatePasswordInputLength(password);

            expect(isValid).toBe(true);
        });

        it('returns false when password is not provided', () => {
            const password = undefined;

            const isValid = validatePasswordInputLength(password);

            expect(isValid).toBe(false);
        });
    });
});