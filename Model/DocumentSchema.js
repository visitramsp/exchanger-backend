const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    document_type: {
        type: String,
        required: true,
        enum: ['pan_card', 'aadhaar', 'passport'],
    },
    pan_card: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
});
const documentModel = mongoose.model('Document', DocumentSchema);

module.exports = { documentModel }