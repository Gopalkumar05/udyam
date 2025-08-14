require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { validateStep1, validateStep2 } = require('./validation');
const path = require('path');
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;


 app.use(cors(
));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});




        

app.use(express.json());

// Generate OTP endpoint
app.post('/api/generate-otp', async (req, res) => {
  const { aadhaar } = req.body;
  const validationError = validateStep1({ aadhaar });
  
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to database (or cache in production)
    await prisma.otpRecord.upsert({
      where: { aadhaar },
      update: { otp },
      create: { aadhaar, otp }
    });
    
    // In production: Send OTP via SMS/email
    console.log(`OTP for ${aadhaar}: ${otp}`);
    res.json({ message: 'OTP sent successfully', otp });

    // res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  const { aadhaar, otp } = req.body;
  
  try {
    const record = await prisma.otpRecord.findUnique({
      where: { aadhaar }
    });
    
    if (!record || record.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Delete OTP record after successful verification
    await prisma.otpRecord.delete({ where: { aadhaar } });
    
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit registration endpoint
app.post('/api/submit-registration', async (req, res) => {
  const formData = req.body;
  
  // Validate Step 1 data
  const step1Error = validateStep1(formData);
  if (step1Error) {
    return res.status(400).json({ error: step1Error });
  }
  
  // Validate Step 2 data
  const step2Errors = validateStep2(formData);
  if (Object.keys(step2Errors).length > 0) {
    return res.status(400).json({ errors: step2Errors });
  }
  
  try {
    // Save registration to database
    const registration = await prisma.registration.create({
      data: {
        aadhaar: formData.aadhaar,
        pan: formData.pan,
        name: formData.name,
        category: formData.category,
        gender: formData.gender,
        businessName: formData.businessName,
        organizationType: formData.organizationType,
        pincode: formData.pincode,
        state: formData.state,
        district: formData.district,
        address: formData.address
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Registration successful',
      udyamNumber: `UDYAM-${Date.now()}-${registration.id}`
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate registration
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Aadhaar number already registered' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Udyam Registration API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
