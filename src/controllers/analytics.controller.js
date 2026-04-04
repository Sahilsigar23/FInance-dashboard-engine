const analyticsService = require('../services/analytics.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { analyticsQuerySchema } = require('../validators/transaction.validator');

class AnalyticsController {
  /**
   * Get total income
   * @route GET /dashboard/total-income
   * @access Private (Admin, Analyst)
   */
  getTotalIncome = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { startDate, endDate } = value;
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const data = await analyticsService.getTotalIncome(filters);

    res.status(200).json({
      success: true,
      message: 'Total income retrieved successfully',
      data
    });
  });

  /**
   * Get total expense
   * @route GET /dashboard/total-expense
   * @access Private (Admin, Analyst)
   */
  getTotalExpense = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { startDate, endDate } = value;
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const data = await analyticsService.getTotalExpense(filters);

    res.status(200).json({
      success: true,
      message: 'Total expense retrieved successfully',
      data
    });
  });

  /**
   * Get net balance
   * @route GET /dashboard/net-balance
   * @access Private (Admin, Analyst, Viewer)
   */
  getNetBalance = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { startDate, endDate } = value;
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const data = await analyticsService.getNetBalance(filters);

    res.status(200).json({
      success: true,
      message: 'Net balance retrieved successfully',
      data
    });
  });

  /**
   * Get category summary
   * @route GET /dashboard/category-summary
   * @access Private (Admin, Analyst)
   */
  getCategorySummary = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { startDate, endDate, type } = value;
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (type) filters.type = type;

    const data = await analyticsService.getCategorySummary(filters);

    res.status(200).json({
      success: true,
      message: 'Category summary retrieved successfully',
      data
    });
  });

  /**
   * Get monthly trend
   * @route GET /dashboard/monthly-trend
   * @access Private (Admin, Analyst)
   */
  getMonthlyTrend = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { year } = value;
    const filters = { year };

    const data = await analyticsService.getMonthlyTrend(filters);

    res.status(200).json({
      success: true,
      message: 'Monthly trend retrieved successfully',
      data
    });
  });

  /**
   * Get recent activity
   * @route GET /dashboard/recent-activity
   * @access Private (Admin, Analyst)
   */
  getRecentActivity = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { limit } = value;
    const filters = { limit };

    const data = await analyticsService.getRecentActivity(filters);

    res.status(200).json({
      success: true,
      message: 'Recent activity retrieved successfully',
      data
    });
  });

  /**
   * Get dashboard summary (for viewers)
   * @route GET /dashboard/summary
   * @access Private (Admin, Analyst, Viewer)
   */
  getDashboardSummary = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { period } = value;
    const filters = { period };

    const data = await analyticsService.getDashboardSummary(filters);

    res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data
    });
  });
}

module.exports = new AnalyticsController();