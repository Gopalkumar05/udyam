import React from 'react';


const ProgressTracker = ({ currentStep }) => {
  const steps = ['Aadhaar Verification', 'PAN Details'];

  return (
    <div className="progress-tracker">
      {steps.map((label, index) => (
        <div key={index} className="progress-step">
          <div
            className={`progress-circle ${
              currentStep > index
                ? 'completed'
                : currentStep === index + 1
                ? 'active'
                : 'pending'
            }`}
          >
            {index + 1}
          </div>
          <div
            className={`progress-label ${
              currentStep === index + 1 ? 'highlight' : ''
            }`}
          >
            {label}
          </div>
          {index < steps.length - 1 && <div className="progress-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
