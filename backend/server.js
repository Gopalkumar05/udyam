require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { validateStep1, validateStep2 } = require('./validation');
const path = require('path');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// --- OTP Endpoints ---

app.post('/api/generate-otp', async (req, res) => {
  const { aadhaar } = req.body;
  const validationError = validateStep1({ aadhaar });
  
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.otpRecord.upsert({
      where: { aadhaar },
      update: { otp },
      create: { aadhaar, otp }
    });
    
    console.log(`OTP for ${aadhaar}: ${otp}`);
    res.json({ message: 'OTP sent successfully', otp });
  } catch (error) {
    console.error('OTP generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { aadhaar, otp } = req.body;
  
  try {
    const record = await prisma.otpRecord.findUnique({ where: { aadhaar } });
    
    if (!record || record.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await prisma.otpRecord.delete({ where: { aadhaar } });
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Registration Endpoint ---

app.post('/api/submit-registration', async (req, res) => {
  const formData = req.body;

  const step1Error = validateStep1(formData);
  if (step1Error) return res.status(400).json({ error: step1Error });

  const step2Errors = validateStep2(formData);
  if (Object.keys(step2Errors).length > 0) return res.status(400).json({ errors: step2Errors });

  try {
    const registration = await prisma.registration.create({
      data: {
        aadhaar: formData.aadhaar,
        pan: formData.pan,
        name: formData.name,
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

    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Aadhaar number already registered' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Health Check ---

app.get('/', (req, res) => {
  res.send('Udyam Registration API is running');
});

// --- Serve Frontend ---

const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// --- Start Server ---

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- Graceful Shutdown ---

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
