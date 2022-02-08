interface onRequestPasswordResetInterface {
  emailRef: React.RefObject<HTMLInputElement>;
  requestPasswordReset: ({ email }: { email: string }) => void;
  setPassResetLinkSent: (newValue: boolean) => void;
}
export const onRequestPasswordReset = ({ emailRef, requestPasswordReset, setPassResetLinkSent }: onRequestPasswordResetInterface) => {
  if (emailRef.current) {
    requestPasswordReset({ email: emailRef.current?.value });
    setPassResetLinkSent(true);
    setTimeout(() => {
      setPassResetLinkSent(false);
    }, 3000);
  }
};

interface validatePasswordInputLengthInterface {
  passwordRef: React.RefObject<HTMLInputElement>;
  setPassLengthValidity: (newValue: boolean) => void;
}
export const validatePasswordInputLength = ({ passwordRef, setPassLengthValidity }: validatePasswordInputLengthInterface) => {
  if (passwordRef.current) {
    if (passwordRef.current.value.length >= 1) {
      return setPassLengthValidity(true);
    }
    return setPassLengthValidity(false);
  }
  setPassLengthValidity(false);
};
