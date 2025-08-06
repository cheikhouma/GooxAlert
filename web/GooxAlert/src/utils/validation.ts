export const PASSWORD_REQUIREMENTS = {
  minLength: 6,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

export const PHONE_REGEX = /^(\+221|00221)?(75|76|77|78|70)[0-9]{7}$/;

export const validatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= PASSWORD_REQUIREMENTS.minLength) strength++;
  if (PASSWORD_REQUIREMENTS.hasUpperCase.test(password)) strength++;
  if (PASSWORD_REQUIREMENTS.hasLowerCase.test(password)) strength++;
  if (PASSWORD_REQUIREMENTS.hasNumber.test(password)) strength++;
  if (PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) strength++;
  return strength;
};

export const getPasswordStrengthColor = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
    case 3:
      return 'bg-yellow-500';
    case 4:
    case 5:
      return 'bg-green-500';
    default:
      return 'bg-gray-200';
  }
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s+/g, '');
  return PHONE_REGEX.test(cleaned);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateCommune = (commune: string): boolean => {
  return commune.trim().length >= 2;
}; 