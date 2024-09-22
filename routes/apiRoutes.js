const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// GET endpoint
router.get('/', (req, res) => {
     res.status(200).json({ operation_code: 1 });
});

// POST endpoint
router.post('/', async (req, res) => {
     try {
          const { data, file_b64 } = req.body;

          if (!Array.isArray(data)) {
               return res.status(400).json({ is_success: false, error: 'Invalid input format' });
          }

          const numbers = data.filter(item => !isNaN(item));
          const alphabets = data.filter(item => isNaN(item) && item.length === 1);
          const highest_lowercase_alphabet = alphabets
               .filter(char => char.toLowerCase() === char)
               .sort((a, b) => b.localeCompare(a))
               .slice(0, 1);

          let user = await User.findOne();

          if (!user) {
               user = new User({
                    user_id: 'gyanesh_rao_28',
                    email: 'gyaneshrao@gmail.com',
                    roll_number: 'AP21110010239'
               });
               await user.save();
          }

          let fileInfo = {
               file_valid: false,
               file_mime_type: null,
               file_size_kb: null
          };

          if (file_b64) {
               try {
                    const buffer = Buffer.from(file_b64, 'base64');
                    fileInfo.file_valid = true;
                    fileInfo.file_mime_type = getMimeType(buffer);
                    fileInfo.file_size_kb = (buffer.length / 1024).toFixed(2);
               } catch (error) {
                    console.error('Error processing file:', error);
               }
          }

          res.status(200).json({
               is_success: true,
               user_id: user.user_id,
               email: user.email,
               roll_number: user.roll_number,
               numbers: numbers,
               alphabets: alphabets,
               highest_lowercase_alphabet: highest_lowercase_alphabet,
               ...fileInfo
          });
     } catch (error) {
          console.error('Error in POST /bfhl:', error);
          res.status(500).json({ is_success: false, error: error.message });
     }
});

// Helper function to determine MIME type (simplified version)
function getMimeType(buffer) {
     const signature = buffer.toString('hex', 0, 4).toUpperCase();
     switch (signature) {
          case '89504E47':
               return 'image/png';
          case '25504446':
               return 'application/pdf';
          case 'FFD8FFE0':
          case 'FFD8FFE1':
               return 'image/jpeg';
          default:
               return 'application/octet-stream';
     }
}

module.exports = router;