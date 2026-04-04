const userService = require('../services/user.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

class AuthController {
  /**
   * Register a new user
   * @route POST /auth/register
   * @access Public
   */
  register = asyncHandler(async (req, res) => {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Register user
    const { user, token } = await userService.registerUser(value);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  });

  /**
   * Login user
   * @route POST /auth/login
   * @access Public
   */
  login = asyncHandler(async (req, res) => {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Login user
    const { user, token } = await userService.loginUser(value);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  });

  /**
   * Get current user profile
   * @route GET /auth/me
   * @access Private
   */
  getProfile = asyncHandler(async (req, res) => {
    // User is available from auth middleware
    const user = await userService.getUserById(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user
      }
    });
  });
}

module.exports = new AuthController();