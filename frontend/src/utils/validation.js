export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) return 'Aadhaar is required';
  if (!/^\d{12}$/.test(aadhaar)) return 'Invalid Aadhaar format (12 digits required)';
  return null;
};

export const validatePAN = (pan) => {
  if (!pan) return 'PAN is required';
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
    return 'Invalid PAN format (Example: ABCDE1234F)';
  }
  return null;
};