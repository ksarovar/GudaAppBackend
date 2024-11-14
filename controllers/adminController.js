const Admin = require('../models/Admin');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const web3 = require('web3');
const { body, param, validationResult } = require('express-validator');


// Multer setup for file uploads
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
const authenticate = (walletAddress, signature) => {
    return new Promise((resolve, reject) => {
        if (!walletAddress || !signature) {
            return reject({ status: 400, message: 'Wallet address and signature are required!' });
        }
        const message = "Please sign this message to verify your identity.";
        const signer = web3.eth.accounts.recover(message, signature);

        if (signer.toLowerCase() !== walletAddress.toLowerCase()) {
            return reject({ status: 403, message: "Signature verification failed!" });
        }

        Admin.findOne({ walletAddress })
            .then(admin => {
                if (!admin) {
                    return reject({ status: 404, message: "Admin not found!" });
                }

                resolve(admin);
            })
            .catch(err => {
                reject({ status: 500, message: "Internal Server Error", error: err });
            });
    });
};

exports.authenticateWithWallet = async (req, res, next) => {
    const { walletAddress, signature } = req.body;
    try {
        await authenticate(walletAddress, signature);
        const admin = await Admin.findOne({ walletAddress });
        
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        req.admin = admin;
        next();
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
};

// Create Admin
exports.createAdmin = [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('walletAddress').isEthereumAddress().withMessage('Valid wallet address is required.'),
    body('upiId').notEmpty().withMessage('UPI ID is required.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, walletAddress, upiId } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ walletAddress });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists!" });
        }

        try {
            const newAdmin = new Admin({ name, email, walletAddress, upiId });
            await newAdmin.save();
            res.status(201).json({ message: "Admin created successfully!", newAdmin });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get all Admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Admin by Wallet Address
exports.getAdminByWalletAddress = [
    param('walletAddress').isEthereumAddress().withMessage('Valid wallet address is required.'),
    async (req, res) => {
        const { walletAddress } = req.query;
        console.log(walletAddress);
        try {
            const admin = await Admin.findOne({ walletAddress });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found!" });
            }
            res.status(200).json(admin);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Upload Admin Profile Picture
exports.uploadAdminProfilePic = [
    upload.single('profilePic'),
    body('walletAddress').isEthereumAddress().withMessage('Valid wallet address is required.'),
    body('signature').notEmpty().withMessage('Signature is required.'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { walletAddress, signature } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Profile picture is required!' });
        }
        try {
            authenticate(walletAddress, signature)
                .then(async () => {
                    const profilePicPath = req.file.path;
                    const updatedAdmin = await Admin.findOneAndUpdate(
                        { walletAddress },
                        { profilePic: profilePicPath },
                        { new: true }
                    );
                    if (!updatedAdmin) {
                        return res.status(404).json({ message: "Admin not found!" });
                    }
                    res.status(200).json({ message: "Profile picture uploaded successfully!", updatedAdmin });
                })
                .catch(err => res.status(err.status || 500).json({ message: err.message }));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];


// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
    const { walletAddress } = req.body; 
    try {
        const admin = await Admin.findOne({ walletAddress });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Admin Details
exports.updateAdminDetails = async (req, res) => {
    const { walletAddress, name, email } = req.body; 
    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            { walletAddress },
            { name, email },
            { new: true }
        );
        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        res.status(200).json({ message: "Admin updated successfully!", updatedAdmin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
    const { walletAddress } = req.body; 
    try {
        const deletedAdmin = await Admin.findOneAndDelete({ walletAddress });
        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        res.status(200).json({ message: "Admin deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update KYC Status for a user
exports.updateUserKycStatus = async (req, res) => {
    const { walletAddress } = req.params;
    const { kycStatus } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { walletAddress },
            { kycStatus },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "KYC status updated successfully!", updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all Users
exports.getAllUsers = async (req, res) => {
    const { walletAddress, signature } = req.query; // Use query parameters
    try {
        await authenticate(walletAddress, signature);
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const { walletAddress, signature } = req.body; // Authentication wallet address and signature
    const { userWalletAddress } = req.query; // Wallet address of the user to delete

    try {
        // Authenticate using the provided wallet address and signature
        await authenticate(walletAddress, signature);
        const deletedUser = await User.findOneAndDelete({ walletAddress: userWalletAddress });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAdminByWallet = async (req, res) => {
    const { walletAddress, signature } = req.query;

    try {
        await authenticate(walletAddress, signature);
        const admin = await Admin.findOne({ walletAddress });
        
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        
        res.status(200).json(admin);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};


// Get transaction count by status
exports.getAllTransactionCounts = async (req, res) => {
    const { walletAddress, signature } = req.query;
    console.log(walletAddress,signature);

    try {
        const users = await User.find(); // Fetch all users
        // await authenticate(walletAddress, signature);
        // Initialize counts
        const transactionCounts = {
            completed: 0,
            pending: 0,
            cancelled: 0,
            unknown: 0 // For any unexpected status
        };

        // Loop through each user and their transactions
        users.forEach(user => {
            user.transactions.forEach(tx => {
                // Increment the count based on the transaction status
                switch (tx.status) {
                    case 'completed':
                        transactionCounts.completed++;
                        break;
                    case 'pending':
                        transactionCounts.pending++;
                        break;
                    case 'cancelled':
                        transactionCounts.cancelled++;
                        break;
                    default:
                        transactionCounts.unknown++;
                }
            });
        });

        // Return the aggregated counts
        res.status(200).json({ transactionCounts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Expose authenticate function for middleware use
exports.authenticate = authenticate;
