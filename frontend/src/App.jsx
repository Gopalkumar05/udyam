import React from 'react';
import { FormProvider, FormContext } from './context/FormContext';
import ProgressTracker from './UdyamForm/ProgressTracker';
import Step1Aadhaar from './UdyamForm/Step1Aadhaar';
import Step2PAN from './UdyamForm/Step2PAN';
import './App.css';

function App() {
  return (
    <FormProvider>
      <div className="app-wrapper">
        <div className="form-container">
          <h1 className="form-title">Udyam Registration</h1>

          <FormContext.Consumer>
            {({ step }) => (
              <>
                <ProgressTracker currentStep={step} />
                {step === 1 && <Step1Aadhaar />}
                {step === 2 && <Step2PAN />}
              </>
            )}
          </FormContext.Consumer>
        </div>
      </div>
    </FormProvider>
  );
}

export default App;
