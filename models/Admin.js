const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    upiId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
