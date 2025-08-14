// Validation for Step 1 (Aadhaar verification)
exports.validateStep1 = (data) => {
  if (!data.aadhaar) return 'Aadhaar number is required';
  
  const aadhaar = data.aadhaar.toString().trim();
  
  // Check length
  if (aadhaar.length !== 12) return 'Aadhaar must be 12 digits';
  
  // Check if all digits
  if (!/^\d+$/.test(aadhaar)) return 'Aadhaar must contain only digits';
  
  // Check Verhoeff algorithm (simple checksum)
  if (!isValidAadhaar(aadhaar)) return 'Invalid Aadhaar number';
  
  return null;
};

// Simple Aadhaar checksum validation
function isValidAadhaar(aadhaar) {
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ];
  
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ];
  
  let c = 0;
  const invertedArray = aadhaar.split('').map(Number).reverse();
  
  invertedArray.forEach((num, i) => {
    c = d[c][p[i % 8][num]];
  });
  
  return c === 0;
}

// Validation for Step 2 (PAN and business details)
exports.validateStep2 = (data) => {
  const errors = {};
  
  // PAN validation
  if (!data.pan) {
    errors.pan = 'PAN is required';
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) {
    errors.pan = 'Invalid PAN format (Example: ABCDE1234F)';
  }
  
  // Name validation
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }
  
 
  
 
  
  // Pincode validation
  if (!data.pincode) {
    errors.pincode = 'Pincode is required';
  } else if (!/^\d{6}$/.test(data.pincode)) {
    errors.pincode = 'Pincode must be 6 digits';
  }
  
  // Address validation
  if (!data.address || data.address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters';
  }
  
  return errors;
};