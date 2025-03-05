const mongoose = require('mongoose');

const DocsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    uploadedBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

const Docs = mongoose.model('Docs', DocsSchema);
module.exports = Docs;
