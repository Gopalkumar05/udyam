

import React, { useContext, useState } from 'react';
import { FormContext } from '../context/FormContext';
import InputField from '../UI/InputField';
import Button from '../UI/Button';
import { validateAadhaar } from '../utils/validation';

const Step1Aadhaar = () => {
  const { formData, updateFormData, nextStep } = useContext(FormContext);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle OTP generation
  const handleGenerateOTP = async () => {
    const aadhaarError = validateAadhaar(formData.aadhaar);
    if (aadhaarError) {
      setErrors({ aadhaar: aadhaarError });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('https://udyamr1.onrender.com/api/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar: formData.aadhaar })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ aadhaar: data.error || 'Failed to send OTP' });
      } else {
        setOtpSent(true);
      }
    } catch (error) {
      setErrors({ aadhaar: 'Network error, try again' });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleSubmit = async () => {
    if (!formData.otp) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://udyamr1.onrender.com/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaar: formData.aadhaar,
          otp: formData.otp
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ otp: data.error || 'Invalid OTP' });
      } else {
        nextStep();
      }
    } catch (error) {
      setErrors({ otp: 'Network error, try again' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step1-container">
      <h2 className="step1-title">Aadhaar Verification</h2>

      <InputField
        label="Aadhaar Number"
        name="aadhaar"
        value={formData.aadhaar}
        onChange={(e) => updateFormData('aadhaar', e.target.value)}
        placeholder="Enter 12-digit Aadhaar"
        error={errors.aadhaar}
        maxLength={12}
      />

      <Button
        onClick={handleGenerateOTP}
        className="btn-generate-otp"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Generate OTP'}
      </Button>

      {otpSent && (
        <div className="otp-section">
          <InputField
            label="OTP"
            name="otp"
            value={formData.otp}
            onChange={(e) => updateFormData('otp', e.target.value)}
            placeholder="Enter 6-digit OTP"
            error={errors.otp}
            maxLength={6}
          />

          <Button
            onClick={handleSubmit}
            className="btn-verify"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Step1Aadhaar;
