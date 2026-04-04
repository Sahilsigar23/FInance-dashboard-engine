const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique transaction identifier
 *         amount:
 *           type: number
 *           format: decimal
 *           description: Transaction amount
 *         type:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *           description: Transaction type
 *         category:
 *           type: string
 *           description: Transaction category
 *         date:
 *           type: string
 *           format: date
 *           description: Transaction date
 *         description:
 *           type: string
 *           nullable: true
 *           description: Transaction description
 *         createdBy:
 *           type: string
 *           description: ID of user who created the transaction
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         user:
 *           $ref: '#/components/schemas/User'
 *     
 *     TransactionListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             transactions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 */

/**
 * @swagger
 * /transactions/categories:
 *   get:
 *     summary: Get all transaction categories
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/categories', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), transactionController.getCategories);

/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Get transaction summary
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: Transaction summary retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/summary', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), transactionController.getTransactionsSummary);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in transaction description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by transaction type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionListResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), transactionController.getAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), transactionController.getTransactionById);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0.01
 *                 example: 1250.50
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: "INCOME"
 *               category:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Salary"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Monthly salary payment"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.post('/', authenticateUser, authorizeRoles('ADMIN'), transactionController.createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0.01
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Transaction not found
 */
router.patch('/:id', authenticateUser, authorizeRoles('ADMIN'), transactionController.updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete transaction (soft delete)
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), transactionController.deleteTransaction);

module.exports = router;