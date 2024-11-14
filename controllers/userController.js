const User = require('../models/User');
const { Web3 } = require('web3');
const multer = require('multer');
const path = require('path');
const { body, param, query, validationResult } = require('express-validator');
require('dotenv').config();
// const web3Helper = require('../utils/blockchain'); // Helper for fetching balances

const web3 = new Web3();
const crypto = require('crypto');
const fs = require('fs');

// Encryption settings
const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); // Store this securely
const iv = crypto.randomBytes(16);

// Function to encrypt the document
const encrypt = (buffer) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { encryptedData: encrypted, iv: iv.toString('hex') };
};

const decrypt = (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
};

// Configure multer for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Authenticate function
const authenticate = async (walletAddress, signature) => {
    if (!walletAddress || !signature) {
        throw { status: 400, message: 'Wallet address and signature are required!' };
    }

    const message = "Please sign this message to verify your identity.";
    const signer = web3.eth.accounts.recover(message, signature);

    if (signer.toLowerCase() !== walletAddress.toLowerCase()) {
        throw { status: 403, message: "Signature verification failed!" };
    }

    const user = await User.findOne({ walletAddress });
    if (!user) {
        throw { status: 404, message: "User not found!" };
    }

    return user;
};

// Authenticate with Web3 wallet
exports.authenticateWithWallet = [
    body('walletAddress').isEthereumAddress(),
    body('signature').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress, signature } = req.body;

        try {
            const user = await authenticate(walletAddress, signature);
            res.status(200).json({ message: "User authenticated successfully!", user });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
        }
    }
];

// Save user profile with profile picture upload
exports.saveUserProfile = [
    body('name').notEmpty(),
    body('upiId').notEmpty(),
    body('email').isEmail(),
    body('walletAddress').isEthereumAddress(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, upiId, email, walletAddress, mobile } = req.body;
        const profilePic = req.file ? req.file.path : null;

        User.findOne({ walletAddress })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists!" });
                }

                const newUser = new User({ name, upiId, email, profilePic, walletAddress, mobile });
                return newUser.save();
            })
            .then(newUser => {
                res.status(201).json({ message: "User profile created successfully!", user: newUser });
            })
            .catch(err => {
                if (!res.headersSent) {
                    return res.status(500).json({ error: err.message });
                }
            });
    }
];

// Update user profile
exports.updateUserProfile = [
    body('walletAddress').isEthereumAddress(),
    body('signature').notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress, signature } = req.body;

        authenticate(walletAddress, signature)
            .then(async user => {
                const updatedData = req.body;
                if (req.file) {
                    updatedData.profilePic = req.file.path; // Update profile picture if uploaded
                }

                const updatedUser = await User.findOneAndUpdate({ walletAddress }, updatedData, { new: true });
                if (!updatedUser) {
                    return res.status(404).json({ message: "User not found!" });
                }

                res.status(200).json({ message: "User profile updated successfully!", updatedUser });
            })
            .catch(err => res.status(err.status || 500).json({ message: err.message }));
    }
];

// Upload user document
exports.uploadDocument = [
    upload.single('document'),
    body('walletAddress').isEthereumAddress(),
    body('signature').notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress, signature } = req.body;

        authenticate(walletAddress, signature)
            .then(async user => {
                const documentPath = req.file.path;

                const existingUser = await User.findOne({ walletAddress });
                if (!existingUser) {
                    return res.status(404).json({ message: "User not found!" });
                }

                const updatedUser = await User.findOneAndUpdate(
                    { walletAddress },
                    { $push: { documents: documentPath } },
                    { new: true }
                );

                res.status(200).json({ message: "Document uploaded successfully!", updatedUser });
            })
            .catch(err => res.status(err.status || 500).json({ message: err.message }));
    }
];

// Save transaction
exports.saveTransaction = [
    body('walletAddress').isEthereumAddress(),
    body('type').notEmpty(),
    body('amount').isNumeric(),
    body('from').notEmpty(),
    body('to').notEmpty(),
    body('note').optional().isString(),
    body('status').optional().isIn(['completed', 'pending', 'cancelled']),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress, type, amount, from, to, note, status = 'pending' } = req.body; // Default to 'pending'
        const newTransaction = { type, amount, from, to, note, status };

        try {
            const updatedUser = await User.findOneAndUpdate(
                { walletAddress },
                { $push: { transactions: newTransaction } },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found!" });
            }

            res.status(201).json({ message: "Transaction saved successfully!", updatedUser });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Update transaction status
exports.updateTransactionStatus = [
    param('walletAddress').isEthereumAddress(),
    body('transactionId').isString(),
    body('status').isIn(['completed', 'pending', 'cancelled']),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;
        const { transactionId, status } = req.body;

        try {
            const updatedUser = await User.findOneAndUpdate(
                { walletAddress, 'transactions._id': transactionId },
                { $set: { 'transactions.$.status': status } },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User or transaction not found!" });
            }

            res.status(200).json({ message: "Transaction status updated successfully!", updatedUser });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get user by wallet address
exports.getUserByWalletAddress = [
    param('walletAddress').isEthereumAddress(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;
        try {
            const user = await User.findOne({ walletAddress });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            res.status(200).json({ user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get complete transaction history
exports.getCompleteTransactionHistory = [
    param('walletAddress').isEthereumAddress(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;
        try {
            const user = await User.findOne({ walletAddress });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            res.status(200).json({ transactions: user.transactions });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get recent transactions
exports.getRecentTransactions = [
    query('walletAddress').isEthereumAddress(),
    query('limit').optional().isNumeric(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.query;
        const { limit = 10 } = req.query;
        console.log(walletAddress)


        try {
            const user = await User.findOne({ walletAddress });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            // Get the last 'limit' transactions
            const recentTransactions = user.transactions.slice(-limit);
            res.status(200).json({ transactions: recentTransactions });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get transactions by wallet address and status
exports.getTransactionsByStatus = [
    param('walletAddress').isEthereumAddress(),
    query('status').optional().isIn(['completed', 'pending', 'cancelled']),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;
        const { status } = req.query;

        try {
            const user = await User.findOne({ walletAddress });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            const transactions = status
                ? user.transactions.filter(tx => tx.status === status)
                : user.transactions;

            res.status(200).json({ transactions });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get transactions by wallet address and type
exports.getTransactionsByType = [
    param('walletAddress').isEthereumAddress(),
    query('type').optional().isIn(['sent', 'received']),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;
        const { type } = req.query;

        try {
            const user = await User.findOne({ walletAddress });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            const transactions = type
                ? user.transactions.filter(tx => tx.type === type)
                : user.transactions;

            res.status(200).json({ transactions });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get transaction count by status
exports.getTransactionCountByStatus = [
    param('walletAddress').isEthereumAddress(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;

        try {
            const user = await User.findOne({ walletAddress });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            const transactionCounts = user.transactions.reduce((acc, tx) => {
                acc[tx.status] = (acc[tx.status] || 0) + 1;
                return acc;
            }, { completed: 0, pending: 0, cancelled: 0 });

            res.status(200).json({ transactionCounts });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];


// exports.updateuserBalance = [ async (req, res) => {
//     const { walletAddress } = req.params;
//     try {
//         // Find user by wallet address
//         const user = await User.findOne({ walletAddress });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Fetch all balances (ETH, USDC (ETH), MATIC, USDC (Polygon))
//         const balances = await web3Helper.getAllBalances(walletAddress);

//         // Update user balances
//         user.balances = balances;
//         await user.save();

//         res.status(200).json({
//             message: 'Balances updated successfully',
//             balances
//         });
//     } catch (error) {
//         console.error('Error updating balances:', error);
//         res.status(500).json({ error: 'Server error', details: error.message });
//     }
// }]
// exports.getuserBalance = [ async (req, res) => {
//     const { walletAddress } = req.params;
//     try {
//         // Find user by wallet address
//         const user = await User.findOne({ walletAddress });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json({
//             balances: user.balances
//         });
//     } catch (error) {
//         console.error('Error fetching balances:', error);
//         res.status(500).json({ error: 'Server error', details: error.message });
//     }
// }]
