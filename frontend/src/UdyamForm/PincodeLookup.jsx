import React, { useContext, useEffect, useState } from 'react';
import { FormContext } from '../context/FormContext';
import InputField from '../UI/InputField';
import { lookupPincode } from '../utils/api';

const PincodeLookup = () => {
  const { formData, updateFormData } = useContext(FormContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetchLocation();
    }
  }, [formData.pincode]);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const location = await lookupPincode(formData.pincode);
      if (location) {
        updateFormData('state', location.state);
        updateFormData('district', location.district);
      }
    } catch (error) {
      console.error('Pincode lookup failed:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <InputField
        label="Pincode"
        name="pincode"
        value={formData.pincode}
        onChange={(e) => updateFormData('pincode', e.target.value)}
        placeholder="6-digit pincode"
        maxLength={6}
      />

      <div className="two-column-grid">
        <InputField
          label="State"
          name="state"
          value={formData.state}
          onChange={(e) => updateFormData('state', e.target.value)}
          disabled={loading}
        />

        <InputField
          label="District"
          name="district"
          value={formData.district}
          onChange={(e) => updateFormData('district', e.target.value)}
          disabled={loading}
        />
      </div>

      <InputField
        label="Full Address"
        name="address"
        value={formData.address}
        onChange={(e) => updateFormData('address', e.target.value)}
        textarea
        rows={3}
      />
    </>
  );
};

export default PincodeLookup;
