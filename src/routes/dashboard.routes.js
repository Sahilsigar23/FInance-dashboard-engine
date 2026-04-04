const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

/**
 * @swagger
 * /dashboard/total-income:
 *   get:
 *     summary: Get total income
 *     tags: [Dashboard Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Total income retrieved successfully
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
 *                     totalIncome:
 *                       type: number
 *                       format: decimal
 *                     transactionCount:
 *                       type: integer
 *                     period:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         description:
 *                           type: string
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/total-income', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), analyticsController.getTotalIncome);

/**
 * @swagger
 * /dashboard/total-expense:
 *   get:
 *     summary: Get total expense
 *     tags: [Dashboard Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Total expense retrieved successfully
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
 *                     totalExpense:
 *                       type: number
 *                       format: decimal
 *                     transactionCount:
 *                       type: integer
 *                     period:
 *                       type: object
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/total-expense', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), analyticsController.getTotalExpense);

/**
 * @swagger
 * /dashboard/net-balance:
 *   get:
 *     summary: Get net balance
 *     tags: [Dashboard Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Net balance retrieved successfully
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
 *                     netBalance:
 *                       type: number
 *                       format: decimal
 *                     totalIncome:
 *                       type: number
 *                       format: decimal
 *                     totalExpense:
 *                       type: number
 *                       format: decimal
 *                     incomeTransactions:
 *                       type: integer
 *                     expenseTransactions:
 *                       type: integer
 *                     totalTransactions:
 *                       type: integer
 *                     period:
 *                       type: object
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin, Analyst, or Viewer access required
 */
router.get('/net-balance', authenticateUser, authorizeRoles('ADMIN', 'ANALYST', 'VIEWER'), analyticsController.getNetBalance);

/**
 * @swagger
 * /dashboard/category-summary:
 *   get:
 *     summary: Get category summary
 *     tags: [Dashboard Analytics]
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: Category summary retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [INCOME, EXPENSE]
 *                           amount:
 *                             type: number
 *                             format: decimal
 *                           transactionCount:
 *                             type: integer
 *                           percentage:
 *                             type: number
 *                             format: decimal
 *                     totalAmount:
 *                       type: number
 *                       format: decimal
 *                     totalTransactions:
 *                       type: integer
 *                     categoryGroups:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           income:
 *                             type: number
 *                             format: decimal
 *                           expense:
 *                             type: number
 *                             format: decimal
 *                           net:
 *                             type: number
 *                             format: decimal
 *                           totalTransactions:
 *                             type: integer
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/category-summary', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), analyticsController.getCategorySummary);

/**
 * @swagger
 * /dashboard/monthly-trend:
 *   get:
 *     summary: Get monthly trend data
 *     tags: [Dashboard Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2000
 *         description: Year for trend analysis (default current year)
 *     responses:
 *       200:
 *         description: Monthly trend retrieved successfully
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
 *                     year:
 *                       type: integer
 *                     months:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                           monthName:
 *                             type: string
 *                           year:
 *                             type: integer
 *                           income:
 *                             type: number
 *                             format: decimal
 *                           expense:
 *                             type: number
 *                             format: decimal
 *                           net:
 *                             type: number
 *                             format: decimal
 *                           incomeTransactions:
 *                             type: integer
 *                           expenseTransactions:
 *                             type: integer
 *                           totalTransactions:
 *                             type: integer
 *                           date:
 *                             type: string
 *                             format: date
 *                     yearTotals:
 *                       type: object
 *                       properties:
 *                         income:
 *                           type: number
 *                           format: decimal
 *                         expense:
 *                           type: number
 *                           format: decimal
 *                         net:
 *                           type: number
 *                           format: decimal
 *                         transactions:
 *                           type: integer
 *                     summary:
 *                       type: object
 *                       properties:
 *                         averageMonthlyIncome:
 *                           type: number
 *                           format: decimal
 *                         averageMonthlyExpense:
 *                           type: number
 *                           format: decimal
 *                         averageMonthlyNet:
 *                           type: number
 *                           format: decimal
 *                         averageMonthlyTransactions:
 *                           type: number
 *                           format: decimal
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/monthly-trend', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), analyticsController.getMonthlyTrend);

/**
 * @swagger
 * /dashboard/recent-activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of recent transactions to retrieve
 *     responses:
 *       200:
 *         description: Recent activity retrieved successfully
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
 *                     transactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: integer
 *                         totalAmount:
 *                           type: number
 *                           format: decimal
 *                         incomeCount:
 *                           type: integer
 *                         expenseCount:
 *                           type: integer
 *                         categories:
 *                           type: array
 *                           items:
 *                             type: string
 *                         dateRange:
 *                           type: object
 *                           properties:
 *                             latest:
 *                               type: string
 *                               format: date-time
 *                             oldest:
 *                               type: string
 *                               format: date-time
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or Analyst access required
 */
router.get('/recent-activity', authenticateUser, authorizeRoles('ADMIN', 'ANALYST'), analyticsController.getRecentActivity);

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (for viewers)
 *     tags: [Dashboard Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [current_month, current_year, last_30_days, last_90_days]
 *           default: current_month
 *         description: Time period for summary
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
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
 *                     period:
 *                       type: string
 *                     dateRange:
 *                       type: object
 *                       properties:
 *                         startDate:
 *                           type: string
 *                           format: date-time
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *                     netBalance:
 *                       type: object
 *                     topSpendingCategories:
 *                       type: array
 *                       items:
 *                         type: object
 *                     totalCategories:
 *                       type: integer
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         hasTransactions:
 *                           type: boolean
 *                         isPositive:
 *                           type: boolean
 *                         activeCategories:
 *                           type: integer
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin, Analyst, or Viewer access required
 */
router.get('/summary', authenticateUser, authorizeRoles('ADMIN', 'ANALYST', 'VIEWER'), analyticsController.getDashboardSummary);

module.exports = router;