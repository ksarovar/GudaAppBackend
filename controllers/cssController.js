const Css = require('../models/Css');
const web3 = require('web3');
const Admin = require('../models/Admin');
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
exports.createCss = async (req, res) => {
    const { walletAddress, signature, ...cssData } = req.body;

    try {
        const admin = await authenticate(walletAddress, signature);
        const css = new Css({ ...cssData });
        await css.save();
        return res.status(201).json({ message: 'CSS properties saved successfully', css });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

exports.getAllCss = async (req, res) => {
    try {
        const cssList = await Css.find();
        res.status(200).json(cssList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCssById = async (req, res) => {
    const { id } = req.params;
    try {
        const cssData = await Css.findById(id);
        if (!cssData) {
            return res.status(404).json({ message: "CSS properties not found!" });
        }
        res.status(200).json(cssData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCss = async (req, res) => {
    const { walletAddress, signature, ...cssData } = req.body;
    const { id } = req.params;

    try {
        const admin = await authenticate(walletAddress, signature);
        const css = await Css.findByIdAndUpdate(id, cssData, { new: true });
        if (!css) {
            return res.status(404).json({ message: 'CSS properties not found' });
        }
        return res.status(200).json({ message: 'CSS properties updated successfully', css });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

exports.deleteCss = async (req, res) => {
    const { id } = req.params;
    try {
        const cssData = await Css.findByIdAndDelete(id);
        if (!cssData) {
            return res.status(404).json({ message: "CSS properties not found!" });
        }
        res.status(200).json({ message: "CSS properties deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
