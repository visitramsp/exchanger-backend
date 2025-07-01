const mongoose = require('mongoose');

const adminRegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_type: {
    type: String,
    required: [true, 'User type is required'],
    enum: ['admin'],
    message: 'User type must be admin',
  },
  isLogin: {
    type: Boolean,
    default: false, 
  },
});

const adminRegisters = mongoose.model("Admin", adminRegisterSchema);
module.exports = { adminRegisters };
