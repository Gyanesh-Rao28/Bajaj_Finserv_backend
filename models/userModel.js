const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
     user_id: {
          type: String,
          required: true,
          unique: true
     },
     email: {
          type: String,
          required: true,
          unique: true
     },
     roll_number: {
          type: String,
          required: true,
          unique: true
     }
});

module.exports = mongoose.model('User', UserSchema);