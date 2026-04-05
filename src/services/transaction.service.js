const { prisma } = require('../config/database');

class TransactionService {
  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @param {string} userId - User ID creating the transaction
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(transactionData, userId) {
    const { amount, type, category, date, description } = transactionData;

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        description,
        createdBy: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return transaction;
  }

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction data
   */
  async getTransactionById(transactionId) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        isDeleted: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  /**
   * Get all transactions with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Transactions list with pagination
   */
  async getAllTransactions(options = {}) {
    const {
      page = 1,
      limit = parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
      search,
      category,
      type,
      startDate,
      endDate,
      userId
    } = options;

    const skip = (page - 1) * limit;
    const maxLimit = parseInt(process.env.MAX_PAGE_SIZE) || 100;
    const finalLimit = Math.min(limit, maxLimit);

    // Build where clause
    const where = {
      isDeleted: false
    };

    // Search in description
    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by transaction type
    if (type) {
      where.type = type;
    }

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

    // Filter by user (for user-specific queries)
    if (userId) {
      where.createdBy = userId;
    }

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
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
        skip,
        take: finalLimit,
        orderBy: { date: 'desc' }
      }),
      prisma.transaction.count({ where })
    ]);

    const totalPages = Math.ceil(total / finalLimit);

    return {
      transactions,
      pagination: {
        page,
        limit: finalLimit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Update transaction
   * @param {string} transactionId - Transaction ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated transaction
   */
  async updateTransaction(transactionId, updateData) {
    // Check if transaction exists and is not deleted
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        isDeleted: false
      }
    });

    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    const { amount, type, category, date, description } = updateData;
    const dataToUpdate = {};

    if (amount !== undefined) dataToUpdate.amount = amount;
    if (type) dataToUpdate.type = type;
    if (category) dataToUpdate.category = category;
    if (date) dataToUpdate.date = new Date(date);
    if (description !== undefined) dataToUpdate.description = description;

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: dataToUpdate,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return transaction;
  }

  /**
   * Soft delete transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<void>}
   */
  async deleteTransaction(transactionId) {
    // Check if transaction exists and is not already deleted
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        isDeleted: false
      }
    });

    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { isDeleted: true }
    });
  }

  /**
   * Hard delete transaction (Admin only)
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<void>}
   */
  async hardDeleteTransaction(transactionId) {
    await prisma.transaction.delete({
      where: { id: transactionId }
    });
  }

  /**
   * Get transactions summary
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Transaction summary
   */
  async getTransactionsSummary(filters = {}) {
    const { startDate, endDate, userId } = filters;

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

    // Get aggregations
    const [totalIncome, totalExpense, transactionCount, categoryBreakdown] = await Promise.all([
      // Total income
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true }
      }),
      // Total expense
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true }
      }),
      // Total transaction count
      prisma.transaction.count({ where }),
      // Category breakdown
      prisma.transaction.groupBy({
        by: ['category', 'type'],
        where,
        _sum: { amount: true },
        _count: true
      })
    ]);

    const incomeAmount = totalIncome._sum.amount || 0;
    const expenseAmount = totalExpense._sum.amount || 0;
    const netBalance = Number(incomeAmount) - Number(expenseAmount);

    return {
      totalIncome: incomeAmount,
      totalExpense: expenseAmount,
      netBalance,
      transactionCount,
      categoryBreakdown: categoryBreakdown.map(item => ({
        category: item.category,
        type: item.type,
        amount: item._sum.amount,
        count: item._count
      }))
    };
  }

  /**
   * Get monthly trend data
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Monthly trend data
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

    const monthlyData = await prisma.transaction.groupBy({
      by: ['type'],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    });

    // Get monthly breakdown
    const months = [];
    for (let month = 1; month <= 12; month++) {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59);

      const [incomeSum, expenseSum] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            ...where,
            type: 'INCOME',
            date: { gte: monthStart, lte: monthEnd }
          },
          _sum: { amount: true }
        }),
        prisma.transaction.aggregate({
          where: {
            ...where,
            type: 'EXPENSE',
            date: { gte: monthStart, lte: monthEnd }
          },
          _sum: { amount: true }
        })
      ]);

      const income = incomeSum._sum.amount || 0;
      const expense = expenseSum._sum.amount || 0;

      months.push({
        month: month,
        monthName: monthStart.toLocaleString('default', { month: 'long' }),
        income: Number(income),
        expense: Number(expense),
        net: Number(income) - Number(expense)
      });
    }

    return months;
  }

  /**
   * Get recent activity
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Recent transactions
   */
  async getRecentActivity(filters = {}) {
    const { limit = 5, userId } = filters;

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

    return recentTransactions;
  }

  /**
   * Get unique categories
   * @returns {Promise<Array>} List of unique categories
   */
  async getCategories() {
    const categories = await prisma.transaction.findMany({
      where: { isDeleted: false },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });

    return categories.map(item => item.category);
  }
}

module.exports = new TransactionService();