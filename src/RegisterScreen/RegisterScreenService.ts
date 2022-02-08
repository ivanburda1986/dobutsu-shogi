interface validatePasswordInputLengthInterface {
  passwordRef: React.RefObject<HTMLInputElement>;
  setPassLengthValidity: (newValue: boolean) => void;
}
export const validatePasswordInputLength = ({ passwordRef, setPassLengthValidity }: validatePasswordInputLengthInterface) => {
  if (passwordRef.current) {
    if (passwordRef.current.value.length >= 6) {
      return setPassLengthValidity(true);
    }
    return setPassLengthValidity(false);
  }
  setPassLengthValidity(false);
};

interface validateUsernameInputLengthInterface {
  usernameRef: React.RefObject<HTMLInputElement>;
  setUsernameValidity: (newValue: boolean) => void;
}
export const validateUsernameInputLength = ({ usernameRef, setUsernameValidity }: validateUsernameInputLengthInterface) => {
  if (usernameRef.current) {
    if (usernameRef.current.value.length >= 2) {
      return setUsernameValidity(true);
    }
    return setUsernameValidity(false);
  }
  setUsernameValidity(false);
};

interface validatePasswordMatchInterface {
  passwordRef: React.RefObject<HTMLInputElement>;
  confirmPasswordRef: React.RefObject<HTMLInputElement>;
  setPassMatchValidity: (newValue: boolean) => void;
}
export const validatePasswordMatch = ({ passwordRef, confirmPasswordRef, setPassMatchValidity }: validatePasswordMatchInterface) => {
  if (passwordRef.current && confirmPasswordRef.current) {
    if (passwordRef.current?.value === confirmPasswordRef.current?.value) {
      return setPassMatchValidity(true);
    }
  }
  return setPassMatchValidity(false);
};

export const validateEmail = (email: string | undefined) => {
  const validationRegex = /\S+@\S+\.\S+/;
  if (email === undefined) {
    return false;
  }
  return validationRegex.test(email);
};
