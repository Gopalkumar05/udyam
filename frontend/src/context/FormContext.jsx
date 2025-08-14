import React, { createContext, useState } from 'react';

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aadhaar: '',
    otp: '',
    pan: '',
    name: '',
    pincode: '',
    state: '',
    district: '',
    address: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormContext.Provider
      value={{ step, formData, nextStep, prevStep, updateFormData }}
    >
      {children}
    </FormContext.Provider>
  );
};
