const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB 
mongoose.connect('mongodb+srv://amaan:amaan234@cluster0.lpqw5ik.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the participant collection
const participantSchema = new mongoose.Schema({
  name: String,
  age: Number,
  selectedBatch: String,
});

// Create a model based on the schema
const Participant = mongoose.model('Participant', participantSchema);

// Mock payment function
function CompletePayment({ name, selectedBatch }) {

  // Let's assume the payment is successful
  return { success: true, message: `Payment successful for ${name} - Batch: ${selectedBatch}` };
}

// REST endpoint to handle form submissions
app.post('/api/enroll', async (req, res) => {

  const { name, age, selectedBatch } = req.body;

  // Basic validation
  if (!name || !age || !selectedBatch) {
    return res.status(400).json({ error: 'Invalid data. Please fill in all fields.' });
  }

  // Age limit validation
  if (age < 18 || age > 65) {
    return res.status(400).json({ error: 'Age must be between 18 and 65.' });
  }

  try {
    // Save data to MongoDB
    const participant = new Participant({ name, age, selectedBatch });
    await participant.save();

    // Call the mock payment function
    const paymentResponse = CompletePayment({ name, selectedBatch });

    // Check payment success
    if (paymentResponse.success) {
      // Return success response to the front-end
      res.json({ success: true, message: `Enrollment successful. ${paymentResponse.message}` });
    } else {
      // Return failure response to the front-end
      res.status(500).json({ success: false, message: `Payment failed. ${paymentResponse.message}` });
    }
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
