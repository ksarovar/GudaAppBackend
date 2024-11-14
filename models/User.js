const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true }, // 'sent', 'received', etc.
    amount: { type: Number, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: String,
    status: { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'pending' }, // Add status here
});

const userSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    name: String,
    upiId: String,
    email: String,
    mobile: Number,
    profilePic: String,
    kycStatus: { type: Boolean, default: false },
    documents: [
        {
            path: { type: String, required: true },
            type: { type: String, enum: ['PAN', 'AADHAR', 'DL'], required: true },
            iv: { type: String, required: true },
            extension: { type: String, required: true }
        }
    ],
    balances: {
        eth: { type: String, default: '0' },
        usdcEth: { type: String, default: '0' },
        matic: { type: String, default: '0' },
        usdcPolygon: { type: String, default: '0' }
    },
    transactions: [transactionSchema], // Embed transaction schema for storing user transactions
});

module.exports = mongoose.model('User', userSchema);
