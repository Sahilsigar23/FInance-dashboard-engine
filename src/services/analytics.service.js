const prisma = require('../config/database');

class AnalyticsService {
  /**
   * Get total income
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Total income data
   */
  async getTotalIncome(filters = {}) {
    const { startDate, endDate, userId } = filters;

    const where = {
      isDeleted: false,
      type: 'INCOME'
    };

    // Filter by date range
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Filter by user
    if (userId) {
      where.createdBy = userId;
    }

    const result = await prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _count: true
    });

    return {
      totalIncome: Number(result._sum.amount || 0),
      transactionCount: result._count,
      period: this._getPeriodInfo(startDate, endDate)
    };
  }

  /**
   * Get total expense
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Total expense data
   */
  async getTotalExpense(filters = {}) {
    const { startDate, endDate, userId } = filters;

    const where = {
      isDeleted: false,
      type: 'EXPENSE'
    };

    // Filter by date range
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Filter by user
    if (userId) {
      where.createdBy = userId;
    }

    const result = await prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _count: true
    });

    return {
      totalExpense: Number(result._sum.amount || 0),
      transactionCount: result._count,
      period: this._getPeriodInfo(startDate, endDate)
    };
  }

  /**
   * Get net balance
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Net balance data
   */
  async getNetBalance(filters = {}) {
    const { startDate, endDate, userId } = filters;

    const [incomeData, expenseData] = await Promise.all([
      this.getTotalIncome(filters),
      this.getTotalExpense(filters)
    ]);

    const netBalance = incomeData.totalIncome - expenseData.totalExpense;

    return {
      netBalance,
      totalIncome: incomeData.totalIncome,
      totalExpense: expenseData.totalExpense,
      incomeTransactions: incomeData.transactionCount,
      expenseTransactions: expenseData.transactionCount,
      totalTransactions: incomeData.transactionCount + expenseData.transactionCount,
      period: this._getPeriodInfo(startDate, endDate)
    };
  }

  /**
   * Get category summary
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Category summary data
   */
  async getCategorySummary(filters = {}) {
    const { startDate, endDate, userId, type } = filters;

    const where = {
      isDeleted: false
    };

    // Filter by date range
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Filter by user
    if (userId) {
      where.createdBy = userId;
    }

    // Filter by transaction type
    if (type) {
      where.type = type;
    }

    const categoryData = await prisma.transaction.groupBy({
      by: ['category', 'type'],
      where,
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } }
    });

    // Process the data
    const summary = {
      categories: categoryData.map(item => ({
        category: item.category,
        type: item.type,
        amount: Number(item._sum.amount),
        transactionCount: item._count,
        percentage: 0 // Will be calculated below
      })),
      totalAmount: 0,
      totalTransactions: 0
    };

    // Calculate totals
    summary.totalAmount = summary.categories.reduce((sum, cat) => sum + cat.amount, 0);
    summary.totalTransactions = summary.categories.reduce((sum, cat) => sum + cat.transactionCount, 0);

    // Calculate percentages
    if (summary.totalAmount > 0) {
      summary.categories = summary.categories.map(cat => ({
        ...cat,
        percentage: Number(((cat.amount / summary.totalAmount) * 100).toFixed(2))
      }));
    }

    // Group by category (combining income and expense)
    const categoryGroups = {};
    summary.categories.forEach(cat => {
      if (!categoryGroups[cat.category]) {
        categoryGroups[cat.category] = {
          category: cat.category,
          income: 0,
          expense: 0,
          net: 0,
          totalTransactions: 0
        };
      }

      if (cat.type === 'INCOME') {
        categoryGroups[cat.category].income = cat.amount;
      } else {
        categoryGroups[cat.category].expense = cat.amount;
      }
      
      categoryGroups[cat.category].totalTransactions += cat.transactionCount;
      categoryGroups[cat.category].net = categoryGroups[cat.category].income - categoryGroups[cat.category].expense;
    });

    return {
      ...summary,
      categoryGroups: Object.values(categoryGroups),
      period: this._getPeriodInfo(startDate, endDate)
    };
  }

  /**
   * Get monthly trend
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Monthly trend data
   */
  async getMonthlyTrend(filters = {}) {
    const { year = new Date().getFullYear(), userId } = filters;

    const where = {
      isDeleted: false,
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    };

    if (userId) {
      where.createdBy = userId;
    }

    // Get monthly breakdown
    const months = [];
    for (let month = 1; month <= 12; month++) {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59);

      const [incomeSum, expenseSum, transactionCount] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            ...where,
            type: 'INCOME',
            date: { gte: monthStart, lte: monthEnd }
          },
          _sum: { amount: true },
          _count: true
        }),
        prisma.transaction.aggregate({
          where: {
            ...where,
            type: 'EXPENSE',
            date: { gte: monthStart, lte: monthEnd }
          },
          _sum: { amount: true },
          _count: true
        }),
        prisma.transaction.count({
          where: {
            ...where,
            date: { gte: monthStart, lte: monthEnd }
          }
        })
      ]);

      const income = Number(incomeSum._sum.amount || 0);
      const expense = Number(expenseSum._sum.amount || 0);

      months.push({
        month: month,
        monthName: monthStart.toLocaleString('default', { month: 'long' }),
        year: year,
        income,
        expense,
        net: income - expense,
        incomeTransactions: incomeSum._count,
        expenseTransactions: expenseSum._count,
        totalTransactions: transactionCount,
        date: monthStart.toISOString().slice(0, 7) // YYYY-MM format
      });
    }

    // Calculate year totals
    const yearTotals = months.reduce((totals, month) => ({
      income: totals.income + month.income,
      expense: totals.expense + month.expense,
      net: totals.net + month.net,
      transactions: totals.transactions + month.totalTransactions
    }), { income: 0, expense: 0, net: 0, transactions: 0 });

    return {
      year,
      months,
      yearTotals,
      summary: {
        averageMonthlyIncome: yearTotals.income / 12,
        averageMonthlyExpense: yearTotals.expense / 12,
        averageMonthlyNet: yearTotals.net / 12,
        averageMonthlyTransactions: yearTotals.transactions / 12
      }
    };
  }

  /**
   * Get recent activity
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Recent activity data
   */
  async getRecentActivity(filters = {}) {
    const { limit = 10, userId } = filters;

    const where = {
      isDeleted: false
    };

    if (userId) {
      where.createdBy = userId;
    }

    const recentTransactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get activity summary
    const activitySummary = {
      totalTransactions: recentTransactions.length,
      totalAmount: recentTransactions.reduce((sum, t) => sum + Number(t.amount), 0),
      incomeCount: recentTransactions.filter(t => t.type === 'INCOME').length,
      expenseCount: recentTransactions.filter(t => t.type === 'EXPENSE').length,
      categories: [...new Set(recentTransactions.map(t => t.category))],
      dateRange: {
        latest: recentTransactions[0]?.createdAt,
        oldest: recentTransactions[recentTransactions.length - 1]?.createdAt
      }
    };

    return {
      transactions: recentTransactions,
      summary: activitySummary,
      limit
    };
  }

  /**
   * Get dashboard summary (overview for viewers)
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Dashboard summary
   */
  async getDashboardSummary(filters = {}) {
    const { period = 'current_month', userId } = filters;

    // Calculate date range based on period
    const dateRange = this._getDateRangeForPeriod(period);
    const filtersWithDates = { ...filters, ...dateRange };

    const [netBalance, categorySummary, recentActivity] = await Promise.all([
      this.getNetBalance(filtersWithDates),
      this.getCategorySummary(filtersWithDates),
      this.getRecentActivity({ limit: 5, userId })
    ]);

    // Get top spending categories
    const topCategories = categorySummary.categories
      .filter(cat => cat.type === 'EXPENSE')
      .slice(0, 5);

    return {
      period: period,
      dateRange: dateRange,
      netBalance: netBalance,
      topSpendingCategories: topCategories,
      totalCategories: categorySummary.categories.length,
      recentActivity: recentActivity.transactions.slice(0, 3),
      summary: {
        hasTransactions: netBalance.totalTransactions > 0,
        isPositive: netBalance.netBalance >= 0,
        activeCategories: categorySummary.categories.length
      }
    };
  }

  /**
   * Helper method to get period information
   * @private
   */
  _getPeriodInfo(startDate, endDate) {
    if (!startDate && !endDate) {
      return { type: 'all_time', description: 'All time' };
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return {
      type: 'custom',
      startDate: start?.toISOString().split('T')[0],
      endDate: end?.toISOString().split('T')[0],
      description: `${start ? start.toLocaleDateString() : 'Beginning'} - ${end ? end.toLocaleDateString() : 'Now'}`
    };
  }

  /**
   * Helper method to get date range for predefined periods
   * @private
   */
  _getDateRangeForPeriod(period) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (period) {
      case 'current_month':
        return {
          startDate: new Date(currentYear, currentMonth, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString()
        };
      
      case 'current_year':
        return {
          startDate: new Date(currentYear, 0, 1).toISOString(),
          endDate: new Date(currentYear, 11, 31, 23, 59, 59).toISOString()
        };
      
      case 'last_30_days':
        return {
          startDate: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
          endDate: now.toISOString()
        };
      
      case 'last_90_days':
        return {
          startDate: new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)).toISOString(),
          endDate: now.toISOString()
        };
      
      default:
        return {};
    }
  }
}

module.exports = new AnalyticsService();