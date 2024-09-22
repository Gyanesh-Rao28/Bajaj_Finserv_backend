const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://bajajfinserv-frontend.vercel.app',
]

app.use(cors({allowedOrigins}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
const bfhlRoutes = require('./routes/apiRoutes');

app.use('/bfhl', bfhlRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));