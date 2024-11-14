const express = require('express');
const contactController = require('../controllers/contactController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact management operations
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     tags: [Contact]
 *     summary: Create a new contact
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
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - walletAddress
 *               - signature
 *               - name
 *               - phone
 *               - email
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Bad Request, validation errors
 *       500:
 *         description: Internal Server Error
 */
router.post('/contacts', contactController.createContact);

/**
 * @swagger
 * /api/contacts/{walletAddress}:
 *   get:
 *     tags: [Contact]
 *     summary: Retrieve all contacts for a specific wallet address
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         description: Wallet address to retrieve contacts
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Wallet address not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/contacts/:walletAddress', contactController.getContacts);

/**
 * @swagger
 * /api/contacts/favorites/{walletAddress}:
 *   get:
 *     tags: [Contact]
 *     summary: Retrieve favorite contacts for a specific wallet address
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         description: Wallet address to retrieve favorite contacts
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved favorite contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favoriteContacts:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Wallet address not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/contacts/favorites/:walletAddress', contactController.getFavoriteContacts);

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   put:
 *     tags: [Contact]
 *     summary: Update a contact
 *     parameters:
 *       - name: contactId
 *         in: path
 *         required: true
 *         description: ID of the contact to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               isFavorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/contacts/:contactId', contactController.updateContact);

/**
 * @swagger
 * /api/contacts/{contactId}:
 *   delete:
 *     tags: [Contact]
 *     summary: Delete a contact
 *     parameters:
 *       - name: contactId
 *         in: path
 *         required: true
 *         description: ID of the contact to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/contacts/:contactId', contactController.deleteContact);

module.exports = router;
