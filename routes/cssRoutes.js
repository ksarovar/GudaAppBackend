const express = require('express');
const cssController = require('../controllers/cssController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CSS
 *   description: CSS management operations
 */

/**
 * @swagger
 * /api/css:
 *   post:
 *     tags: [CSS]
 *     summary: Create new CSS properties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: Wallet address of the admin
 *               signature:
 *                 type: string
 *                 description: Signature from the admin
 *               color:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *               backgroundImage:
 *                 type: string
 *               backgroundSize:
 *                 type: string
 *               backgroundRepeat:
 *                 type: string
 *               backgroundPosition:
 *                 type: string
 *               fontSize:
 *                 type: string
 *               fontFamily:
 *                 type: string
 *               fontWeight:
 *                 type: string
 *               fontStyle:
 *                 type: string
 *               lineHeight:
 *                 type: string
 *               letterSpacing:
 *                 type: string
 *               textDecoration:
 *                 type: string
 *               textTransform:
 *                 type: string
 *               margin:
 *                 type: string
 *               padding:
 *                 type: string
 *               border:
 *                 type: string
 *               borderWidth:
 *                 type: string
 *               borderColor:
 *                 type: string
 *               borderStyle:
 *                 type: string
 *               borderRadius:
 *                 type: string
 *               boxShadow:
 *                 type: string
 *               display:
 *                 type: string
 *               position:
 *                 type: string
 *               top:
 *                 type: string
 *               right:
 *                 type: string
 *               bottom:
 *                 type: string
 *               left:
 *                 type: string
 *               zIndex:
 *                 type: number
 *               overflow:
 *                 type: string
 *               width:
 *                 type: string
 *               height:
 *                 type: string
 *               minWidth:
 *                 type: string
 *               minHeight:
 *                 type: string
 *               maxWidth:
 *                 type: string
 *               maxHeight:
 *                 type: string
 *               float:
 *                 type: string
 *               clear:
 *                 type: string
 *               flex:
 *                 type: string
 *               flexDirection:
 *                 type: string
 *               flexWrap:
 *                 type: string
 *               justifyContent:
 *                 type: string
 *               alignItems:
 *                 type: string
 *               alignSelf:
 *                 type: string
 *               gridTemplateColumns:
 *                 type: string
 *               gridTemplateRows:
 *                 type: string
 *               gridArea:
 *                 type: string
 *               gridColumn:
 *                 type: string
 *               gridRow:
 *                 type: string
 *               opacity:
 *                 type: number
 *               cursor:
 *                 type: string
 *               transition:
 *                 type: string
 *               transform:
 *                 type: string
 *               overflowX:
 *                 type: string
 *               overflowY:
 *                 type: string
 *               visibility:
 *                 type: string
 *               whiteSpace:
 *                 type: string
 *               wordWrap:
 *                 type: string
 *               boxSizing:
 *                 type: string
 *               responsive:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: CSS properties saved successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Signature verification failed
 *       404:
 *         description: Admin not found
 */
router.post('/', cssController.createCss);

/**
 * @swagger
 * /api/css:
 *   get:
 *     tags: [CSS]
 *     summary: Get all CSS properties
 *     responses:
 *       200:
 *         description: List of CSS properties
 *       500:
 *         description: Internal Server Error
 */
router.get('/', cssController.getAllCss);

/**
 * @swagger
 * /api/css/{id}:
 *   get:
 *     tags: [CSS]
 *     summary: Get CSS properties by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the CSS properties
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSS properties fetched successfully
 *       404:
 *         description: CSS properties not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', cssController.getCssById);

/**
 * @swagger
 * /api/css/{id}:
 *   put:
 *     tags: [CSS]
 *     summary: Update CSS properties
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the CSS properties
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
 *                 description: Wallet address of the admin
 *               signature:
 *                 type: string
 *                 description: Signature from the admin
 *               color:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *               backgroundImage:
 *                 type: string
 *               backgroundSize:
 *                 type: string
 *               backgroundRepeat:
 *                 type: string
 *               backgroundPosition:
 *                 type: string
 *               fontSize:
 *                 type: string
 *               fontFamily:
 *                 type: string
 *               fontWeight:
 *                 type: string
 *               fontStyle:
 *                 type: string
 *               lineHeight:
 *                 type: string
 *               letterSpacing:
 *                 type: string
 *               textDecoration:
 *                 type: string
 *               textTransform:
 *                 type: string
 *               margin:
 *                 type: string
 *               padding:
 *                 type: string
 *               border:
 *                 type: string
 *               borderWidth:
 *                 type: string
 *               borderColor:
 *                 type: string
 *               borderStyle:
 *                 type: string
 *               borderRadius:
 *                 type: string
 *               boxShadow:
 *                 type: string
 *               display:
 *                 type: string
 *               position:
 *                 type: string
 *               top:
 *                 type: string
 *               right:
 *                 type: string
 *               bottom:
 *                 type: string
 *               left:
 *                 type: string
 *               zIndex:
 *                 type: number
 *               overflow:
 *                 type: string
 *               width:
 *                 type: string
 *               height:
 *                 type: string
 *               minWidth:
 *                 type: string
 *               minHeight:
 *                 type: string
 *               maxWidth:
 *                 type: string
 *               maxHeight:
 *                 type: string
 *               float:
 *                 type: string
 *               clear:
 *                 type: string
 *               flex:
 *                 type: string
 *               flexDirection:
 *                 type: string
 *               flexWrap:
 *                 type: string
 *               justifyContent:
 *                 type: string
 *               alignItems:
 *                 type: string
 *               alignSelf:
 *                 type: string
 *               gridTemplateColumns:
 *                 type: string
 *               gridTemplateRows:
 *                 type: string
 *               gridArea:
 *                 type: string
 *               gridColumn:
 *                 type: string
 *               gridRow:
 *                 type: string
 *               opacity:
 *                 type: number
 *               cursor:
 *                 type: string
 *               transition:
 *                 type: string
 *               transform:
 *                 type: string
 *               overflowX:
 *                 type: string
 *               overflowY:
 *                 type: string
 *               visibility:
 *                 type: string
 *               whiteSpace:
 *                 type: string
 *               wordWrap:
 *                 type: string
 *               boxSizing:
 *                 type: string
 *               responsive:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: CSS properties updated successfully
 *       404:
 *         description: CSS properties not found
 *       400:
 *         description: Bad request
 *       403:
 *         description: Signature verification failed
 */
router.put('/:id', cssController.updateCss);

/**
 * @swagger
 * /api/css/{id}:
 *   delete:
 *     tags: [CSS]
 *     summary: Delete CSS properties
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the CSS properties
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSS properties deleted successfully
 *       404:
 *         description: CSS properties not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', cssController.deleteCss);

module.exports = router;
