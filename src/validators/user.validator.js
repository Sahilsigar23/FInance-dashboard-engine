const Joi = require('joi');

// User creation validation (Admin only)
const createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    }),
  
  role: Joi.string()
    .valid('ADMIN', 'ANALYST', 'VIEWER')
    .default('VIEWER')
    .messages({
      'any.only': 'Role must be one of: ADMIN, ANALYST, VIEWER'
    })
});

// User update validation
const updateUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// User role update validation (Admin only)
const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid('ADMIN', 'ANALYST', 'VIEWER')
    .required()
    .messages({
      'any.only': 'Role must be one of: ADMIN, ANALYST, VIEWER',
      'any.required': 'Role is required'
    })
});

// User status update validation (Admin only)
const updateStatusSchema = Joi.object({
  isActive: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Status must be a boolean value (true or false)',
      'any.required': 'Status is required'
    })
});

// User query validation
const userQuerySchema = Joi.object({
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
  
  role: Joi.string()
    .valid('ADMIN', 'ANALYST', 'VIEWER')
    .messages({
      'any.only': 'Role must be one of: ADMIN, ANALYST, VIEWER'
    }),
  
  isActive: Joi.boolean()
    .messages({
      'boolean.base': 'isActive must be a boolean value (true or false)'
    })
});

// User ID validation
const userIdSchema = Joi.object({
  id: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'any.required': 'User ID is required'
    })
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateRoleSchema,
  updateStatusSchema,
  userQuerySchema,
  userIdSchema
};