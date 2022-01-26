export const validateEmail = (email: string | undefined) => {
  const validationRegex = /\S+@\S+\.\S+/;
  if (email === undefined) {
    return false;
  }
  return validationRegex.test(email);
};
