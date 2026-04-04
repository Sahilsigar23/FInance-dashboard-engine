const Joi = require('joi');

// Transaction creation validation
const createTransactionSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .max(999999999.99)
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'number.max': 'Amount cannot exceed 999,999,999.99',
      'any.required': 'Amount is required'
    }),
  
  type: Joi.string()
    .valid('INCOME', 'EXPENSE')
    .required()
    .messages({
      'any.only': 'Type must be either INCOME or EXPENSE',
      'any.required': 'Transaction type is required'
    }),
  
  category: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Category is required',
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 50 characters'
    }),
  
  date: Joi.date()
    .iso()
    .max('now')
    .required()
    .messages({
      'date.base': 'Please provide a valid date',
      'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
      'date.max': 'Date cannot be in the future',
      'any.required': 'Date is required'
    }),
  
  description: Joi.string()
    .trim()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    })
});

// Transaction update validation
const updateTransactionSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .max(999999999.99)
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'number.max': 'Amount cannot exceed 999,999,999.99'
    }),
  
  type: Joi.string()
    .valid('INCOME', 'EXPENSE')
    .messages({
      'any.only': 'Type must be either INCOME or EXPENSE'
    }),
  
  category: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 50 characters'
    }),
  
  date: Joi.date()
    .iso()
    .max('now')
    .messages({
      'date.base': 'Please provide a valid date',
      'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
      'date.max': 'Date cannot be in the future'
    }),
  
  description: Joi.string()
    .trim()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Transaction query validation
const transactionQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  
  search: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Search term must be at least 2 characters long',
      'string.max': 'Search term must not exceed 100 characters'
    }),
  
  category: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 50 characters'
    }),
  
  type: Joi.string()
    .valid('INCOME', 'EXPENSE')
    .messages({
      'any.only': 'Type must be either INCOME or EXPENSE'
    }),
  
  startDate: Joi.date()
    .iso()
    .messages({
      'date.base': 'Please provide a valid start date',
      'date.format': 'Start date must be in ISO format (YYYY-MM-DD)'
    }),
  
  endDate: Joi.date()
    .iso()
    .when('startDate', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('startDate')),
      otherwise: Joi.date()
    })
    .messages({
      'date.base': 'Please provide a valid end date',
      'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
      'date.min': 'End date must be after start date'
    })
});

// Analytics query validation
const analyticsQuerySchema = Joi.object({
  startDate: Joi.date()
    .iso()
    .messages({
      'date.base': 'Please provide a valid start date',
      'date.format': 'Start date must be in ISO format (YYYY-MM-DD)'
    }),
  
  endDate: Joi.date()
    .iso()
    .when('startDate', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('startDate')),
      otherwise: Joi.date()
    })
    .messages({
      'date.base': 'Please provide a valid end date',
      'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
      'date.min': 'End date must be after start date'
    }),
  
  type: Joi.string()
    .valid('INCOME', 'EXPENSE')
    .messages({
      'any.only': 'Type must be either INCOME or EXPENSE'
    }),
  
  year: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear())
    .default(new Date().getFullYear())
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be 2000 or later',
      'number.max': 'Year cannot be in the future'
    }),
  
  period: Joi.string()
    .valid('current_month', 'current_year', 'last_30_days', 'last_90_days')
    .default('current_month')
    .messages({
      'any.only': 'Period must be one of: current_month, current_year, last_30_days, last_90_days'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    })
});

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
  analyticsQuerySchema
};