const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management operations
 */

/**
 * @swagger
 * /api/admin:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               walletAddress:
 *                 type: string
 *               upiId:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - walletAddress
 *               - upiId
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       500:
 *         description: Internal Server Error
 */
router.post('/', adminController.createAdmin);

/**
 * @swagger
 * /api/admin:
 *   get:
 *     tags: [Admin]
 *     summary: Get all admins
 *     responses:
 *       200:
 *         description: List of admins
 *       500:
 *         description: Internal Server Error
 */
router.get('/', adminController.getAllAdmins);

/**
 * @swagger
 * /api/admin/by-wallet:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin by wallet address
 *     parameters:
 *       - name: walletAddress
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin details fetched successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/by-wallet', adminController.getAdminByWalletAddress);

/**
 * @swagger
 * /api/admin/auth/wallet:
 *   post:
 *     tags: [Admin]
 *     summary: Authenticate admin with Web3 wallet
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
 *         description: Admin authenticated successfully
 *       403:
 *         description: Signature verification failed
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/auth/wallet', adminController.authenticateWithWallet);

/**
 * @swagger
 * /api/admin/profile-pic:
 *   post:
 *     tags: [Admin]
 *     summary: Upload profile picture for the admin
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
 *             required:
 *               - walletAddress
 *               - signature
 *               - profilePic
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/profile-pic', adminController.uploadAdminProfilePic);

// /**
//  * @swagger
//  * /api/admin/profile:
//  *   get:
//  *     tags: [Admin]
//  *     summary: Get admin profile details
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               walletAddress:
//  *                 type: string
//  *               signature:
//  *                 type: string
//  *             required:
//  *               - walletAddress
//  *               - signature
//  *     responses:
//  *       200:
//  *         description: Admin profile fetched successfully
//  *       404:
//  *         description: Admin not found
//  *       500:
//  *         description: Internal Server Error
//  */
// router.get('/profile', adminController.getAdminProfile);

/**
 * @swagger
 * /api/admin:
 *   put:
 *     tags: [Admin]
 *     summary: Update admin details
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
 *               email:
 *                 type: string
 *             required:
 *               - walletAddress
 *               - signature
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/', adminController.updateAdminDetails);

/**
 * @swagger
 * /api/admin:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete admin
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
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/', adminController.deleteAdmin);

/**
 * @swagger
 * /api/admin/user/kyc/{walletAddress}:
 *   put:
 *     tags: [Admin]
 *     summary: Update KYC status for a user by wallet address
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         description: Wallet address of the user to update KYC status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kycStatus:
 *                 type: boolean
 *             required:
 *               - kycStatus
 *     responses:
 *       200:
 *         description: KYC status updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/user/kyc/:walletAddress', adminController.updateUserKycStatus);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users
 *     parameters:
 *       - name: walletAddress
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: signature
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal Server Error
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/user:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a user
 *     parameters:
 *       - name: userWalletAddress
 *         in: query
 *         required: true
 *         description: The wallet address of the user to delete
 *         schema:
 *           type: string
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/user', adminController.deleteUser);
/**
 * @swagger
 * /api/admin/by-wallet:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin by wallet address
 *     parameters:
 *       - name: walletAddress
 *         in: query
 *         required: true
 *         description: The wallet address of the admin
 *         schema:
 *           type: string
 *       - name: signature
 *         in: query
 *         required: true
 *         description: The signature for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin details fetched successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/by-wallet', adminController.getAdminByWallet);

/**
 * @swagger
 * /api/admin/transactions/count/{walletAddress}:
 *   get:
 *     tags: [Admin]
 *     summary: Get transaction count by status
 *     parameters:
 *       - name: walletAddress
 *         in: query
 *         required: true
 *         description: The wallet address of the admin
 *         schema:
 *           type: string
 *       - name: signature
 *         in: query
 *         required: true
 *         description: The signature for authentication
 *     responses:
 *       200:
 *         description: Transaction counts by status
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/transactions/count/:walletAddress', adminController.getAllTransactionCounts);
module.exports = router;
