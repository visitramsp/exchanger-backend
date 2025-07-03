const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    mobile: {
        type: String,
        required: true
    },
    email: String,
    address: String,
    idProofType: String,
    idProofNumber: String,
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const nomineeModel = mongoose.model('nominee', nomineeSchema);
module.exports = nomineeModel