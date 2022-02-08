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
