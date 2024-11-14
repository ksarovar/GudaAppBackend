const Contact = require('../models/Contact');
const User = require('../models/User');
const { body, param, validationResult } = require('express-validator');
const { Web3 } = require('web3');
const web3 = new Web3();

// const { authenticate } = require('./authController'); // Assuming you have this module for authentication
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
// Create a New Contact
exports.createContact = [
    body('walletAddress').isEthereumAddress(),
    body('signature').notEmpty(),
    body('name').notEmpty(),
    body('phone').notEmpty(),
    body('email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress, signature, name, phone, email, address } = req.body;

        try {
            await authenticate(walletAddress, signature); // Verify the signature

            const newContact = new Contact({ walletAddress, name, phone, email, address });
            const savedContact = await newContact.save();
            res.status(201).json({ message: "Contact created successfully!", contact: savedContact });
        } catch (err) {
            res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
        }
    }
];

// Retrieve All Contacts for a Wallet Address
exports.getContacts = [
    param('walletAddress').isEthereumAddress(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;

        try {
            const contacts = await Contact.find({ walletAddress });
            res.status(200).json({ contacts });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Update a Contact
exports.updateContact = [
    param('contactId').isMongoId(),
    body('name').optional().notEmpty(),
    body('phone').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('isFavorite').optional().isBoolean(), // Allow updating favorite status
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { contactId } = req.params;
        const updatedData = req.body;

        try {
            const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });
            if (!updatedContact) {
                return res.status(404).json({ message: "Contact not found!" });
            }

            res.status(200).json({ message: "Contact updated successfully!", contact: updatedContact });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Delete a Contact
 exports.deleteContact = [
    param('contactId').isMongoId(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { contactId } = req.params;

        try {
            const deletedContact = await Contact.findByIdAndDelete(contactId);
            if (!deletedContact) {
                return res.status(404).json({ message: "Contact not found!" });
            }

            res.status(200).json({ message: "Contact deleted successfully!" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Get Favorite Contacts
exports.getFavoriteContacts = [
    param('walletAddress').isEthereumAddress(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { walletAddress } = req.params;

        try {
            const favoriteContacts = await Contact.find({ walletAddress, isFavorite: true });
            res.status(200).json({ favoriteContacts });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];
