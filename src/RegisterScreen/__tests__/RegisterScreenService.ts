import {validatePasswordInputLength} from "../RegisterScreenService";

describe('RegisterScreenService', () => {
    describe('validatePasswordInputLength', () => {
        it('returns true when password has at least 6 characters long', () => {
            const password = "123456";

            const isValid = validatePasswordInputLength(password);

            expect(isValid).toBe(false);
        });

        it('returns false when password is invalid', () => {

        });
    });
});