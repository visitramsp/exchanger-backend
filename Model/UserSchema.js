const { string } = require('joi');
const mongoose = require('mongoose');

const userRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile_no: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  distric: {
    type: String,
    required: true
  },
  city: {
    type: String,
  },
  current_location: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_login: {
    type: Boolean,
    default: false
  },
  user_type: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
}, {
  timestamps: true
});

// const loginUserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true
//   },
//   otp: {
//     type: Number,
//     required: true
//   },
//   create_at: {
//     type: Date,
//     default: Date.now
//   },
//   is_login: {
//     type: Boolean,
//     default: false
//   }
// });


// const loginUserModel = mongoose.model('login_user', loginUserSchema);

const uerRegistrationModel = mongoose.model('users', userRegistrationSchema);

module.exports = { uerRegistrationModel }

