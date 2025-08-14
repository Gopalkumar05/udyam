import React, { useContext, useState } from 'react';
import { FormContext } from '../context/FormContext';
import InputField from '../UI/InputField';
import SelectField from '../UI/SelectField';
import Button from '../UI/Button';
import PincodeLookup from './PincodeLookup';
import { validatePAN } from '../utils/validation';


const Step2PAN = () => {
  const { formData, updateFormData, prevStep } = useContext(FormContext);
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const panError = validatePAN(formData.pan);
    const newErrors = {};

    if (panError) newErrors.pan = panError;
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.businessName) newErrors.businessName = 'Business name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="step2-container">
      <h2 className="step2-title">Business Details</h2>

      <InputField
        label="PAN Number"
        name="pan"
        value={formData.pan}
        onChange={(e) => updateFormData('pan', e.target.value.toUpperCase())}
        placeholder="ABCDE1234F"
        error={errors.pan}
        maxLength={10}
      />

      <InputField
        label="Name as per PAN"
        name="name"
        value={formData.name}
        onChange={(e) => updateFormData('name', e.target.value)}
        error={errors.name}
      />

     

    

    
      <PincodeLookup />

      <div className="step2-buttons">
        <Button onClick={prevStep} className="btn-back">
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Submit Registration
        </Button>
      </div>
    </div>
  );
};

export default Step2PAN;
