const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const router = express.Router();


// Configure multer for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify upload folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage });

// Swagger documentation for user operations
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management operations
 */

/**
 * @swagger
 * /api/auth/wallet:
 *   post:
 *     tags: [User]
 *     summary: Authenticate user with Web3 wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *               signature:
 *                 type: string
 *             required:
 *               - walletAddress
 *               - signature
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       403:
 *         description: Signature verification failed
 *       500:
 *         description: Internal Server Error
 */
router.post('/auth/wallet', userController.authenticateWithWallet);

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags: [User]
 *     summary: Create a new user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               upiId:
 *                 type: string
 *               email:
 *                 type: string
 *               walletAddress:
 *                 type: string
 *               mobile:
 *                 type: number
 *             required:
 *               - name
 *               - upiId
 *               - email
 *               - walletAddress
 *               - mobile
 *     responses:
 *       201:
 *         description: User profile created successfully
 *       500:
 *         description: Internal Server Error
 */
router.post('/user', userController.saveUserProfile);

/**
 * @swagger
 * /api/user:
 *   put:
 *     tags: [User]
 *     summary: Update the user's profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *               signature:
 *                 type: string
 *               name:
 *                 type: string
 *               upiId:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: number
 *               profilePic:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/user', userController.updateUserProfile);

/**
 * @swagger
 * /api/user/profile-pic:
 *   post:
 *     tags: [User]
 *     summary: Upload a profile picture for a user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *               signature:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/user/profile-pic', upload.single('profilePic'), userController.updateUserProfile);

/**
 * @swagger
 * /api/user/wallet/{walletAddress}:
 *   get:
 *     tags: [User]
 *     summary: Get user information by wallet address
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         description: Wallet address of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/user/wallet/:walletAddress', userController.getUserByWalletAddress);

/**
 * @swagger
 * /api/user/transaction:
 *   post:
 *     tags: [User Transaction]
 *     summary: Save a transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               note:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [completed, pending, cancelled]
 *     responses:
 *       201:
 *         description: Transaction saved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/user/transaction', userController.saveTransaction);

/**
 * @swagger
 * /api/user/transaction/{walletAddress}:
 *   put:
 *     tags: [User Transaction]
 *     summary: Update transaction status
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         description: Wallet address of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [completed, pending, cancelled]
 *     responses:
 *       200:
 *         description: Transaction status updated successfully
 *       404:
 *         description: User or transaction not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/user/transaction/:walletAddress', userController.updateTransactionStatus);

/**
 * @swagger
 * /api/user/transactions/history/{walletAddress}:
 *   get:
 *     tags: [User Transaction]
 *     summary: Get complete transaction history
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         description: Wallet address of the user
 *     responses:
 *       200:
 *         description: Complete transaction history
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/user/transactions/history/:walletAddress', userController.getCompleteTransactionHistory);

/**
 * @swagger
 * /api/user/transactions/recent:
 *   get:
 *     tags: [User Transaction]
 *     summary: Get recent transactions
 *     parameters:
 *       - name: walletAddress
 *         in: query
 *         required: true
 *         description: Wallet address of the user
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of recent transactions to retrieve
 *     responses:
 *       200:
 *         description: Recent transactions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/user/transactions/recent', userController.getRecentTransactions);
/**
 * @swagger
 * /api/user/transactions/count/{walletAddress}:
 *   get:
 *     tags: [User Transaction]
 *     summary: Get transaction count by status
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         description: Wallet address of the user
 *     responses:
 *       200:
 *         description: Transaction counts by status
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/user/transactions/count/:walletAddress', userController.getTransactionCountByStatus);
// /**
//  * @swagger
//  * /api/users/update-balances/{walletAddress}:
//  *   post:
//  *     summary: Update wallet balances for ETH, USDC (ETH), MATIC, and USDC (Polygon)
//  *     tags: [User]
//  *     parameters:
//  *       - in: path
//  *         name: walletAddress
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Wallet address to fetch balances for
//  *     responses:
//  *       200:
//  *         description: Balances updated successfully
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Server error
//  */
// router.post('/users/update-balances/:walletAddress',userController.updateuserBalance);
// /**
//  * @swagger
//  * /api/users/balances/{walletAddress}:
//  *   get:
//  *     summary: Get wallet balances for a user
//  *     tags: [User]
//  *     parameters:
//  *       - in: path
//  *         name: walletAddress
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Wallet address to get balances for
//  *     responses:
//  *       200:
//  *         description: User balances retrieved successfully
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/users/balances/:walletAddress',userController.getuserBalance);

module.exports = router;
