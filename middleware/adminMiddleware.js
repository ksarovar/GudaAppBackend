const Admin = require('../models/Admin');
const { Web3 } = require('web3');

const web3 = new Web3();

// Middleware to authenticate admin with wallet
exports.authenticateWithWallet = async (req, res, next) => {
    const { walletAddress, signature } = req.body;
    const message = "Please sign this message to verify your identity.";
    const signer = web3.eth.accounts.recover(message, signature);

    if (signer.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(403).json({ message: "Signature verification failed!" });
    }

    let admin = await Admin.findOne({ walletAddress });
    if (!admin) {
        return res.status(404).json({ message: "Admin not found!" });
    }

    // Attach admin info to the request for later use
    req.admin = admin;
    next();
};
