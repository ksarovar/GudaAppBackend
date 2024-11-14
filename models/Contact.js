const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, optional: true },
    isFavorite: { type: Boolean, default: false }, // Field to mark as favorite
    createdAt: { type: Date, default: Date.now },
});
 
module.exports = mongoose.model('Contact', contactSchema);
