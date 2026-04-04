const transactionService = require('../services/transaction.service');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema
} = require('../validators/transaction.validator');
const { userIdSchema } = require('../validators/user.validator');

class TransactionController {
  /**
   * Get all transactions
   * @route GET /transactions
   * @access Private (Admin, Analyst)
   */
  getAllTransactions = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = transactionQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const result = await transactionService.getAllTransactions(value);

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: result
    });
  });

  /**
   * Get transaction by ID
   * @route GET /transactions/:id
   * @access Private (Admin, Analyst)
   */
  getTransactionById = asyncHandler(async (req, res) => {
    // Validate params
    const { error } = userIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const transaction = await transactionService.getTransactionById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: {
        transaction
      }
    });
  });

  /**
   * Create a new transaction
   * @route POST /transactions
   * @access Private (Admin only)
   */
  createTransaction = asyncHandler(async (req, res) => {
    // Validate request body
    const { error, value } = createTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const transaction = await transactionService.createTransaction(value, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        transaction
      }
    });
  });

  /**
   * Update transaction
   * @route PATCH /transactions/:id
   * @access Private (Admin only)
   */
  updateTransaction = asyncHandler(async (req, res) => {
    // Validate params
    const { error: paramError } = userIdSchema.validate(req.params);
    if (paramError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: paramError.details.map(detail => detail.message)
      });
    }

    // Validate request body
    const { error, value } = updateTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const transaction = await transactionService.updateTransaction(req.params.id, value);

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: {
        transaction
      }
    });
  });

  /**
   * Delete transaction (soft delete)
   * @route DELETE /transactions/:id
   * @access Private (Admin only)
   */
  deleteTransaction = asyncHandler(async (req, res) => {
    // Validate params
    const { error } = userIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    await transactionService.deleteTransaction(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  });

  /**
   * Get transaction categories
   * @route GET /transactions/categories
   * @access Private (Admin, Analyst)
   */
  getCategories = asyncHandler(async (req, res) => {
    const categories = await transactionService.getCategories();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: {
        categories
      }
    });
  });

  /**
   * Get transaction summary
   * @route GET /transactions/summary
   * @access Private (Admin, Analyst)
   */
  getTransactionsSummary = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = transactionQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Extract filters from query
    const { startDate, endDate } = value;
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const summary = await transactionService.getTransactionsSummary(filters);

    res.status(200).json({
      success: true,
      message: 'Transaction summary retrieved successfully',
      data: summary
    });
  });
}

module.exports = new TransactionController();