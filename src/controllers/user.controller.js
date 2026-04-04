const userService = require('../services/user.service');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  createUserSchema,
  updateUserSchema,
  updateRoleSchema,
  updateStatusSchema,
  userQuerySchema,
  userIdSchema
} = require('../validators/user.validator');

class UserController {
  /**
   * Get all users
   * @route GET /users
   * @access Private (Admin only)
   */
  getAllUsers = asyncHandler(async (req, res) => {
    // Validate query parameters
    const { error, value } = userQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const result = await userService.getAllUsers(value);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result
    });
  });

  /**
   * Get user by ID
   * @route GET /users/:id
   * @access Private (Admin only)
   */
  getUserById = asyncHandler(async (req, res) => {
    // Validate params
    const { error } = userIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user
      }
    });
  });

  /**
   * Create a new user
   * @route POST /users
   * @access Private (Admin only)
   */
  createUser = asyncHandler(async (req, res) => {
    // Validate request body
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const user = await userService.createUser(value);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user
      }
    });
  });

  /**
   * Update user
   * @route PATCH /users/:id
   * @access Private (Admin only)
   */
  updateUser = asyncHandler(async (req, res) => {
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
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const user = await userService.updateUser(req.params.id, value);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user
      }
    });
  });

  /**
   * Update user role
   * @route PATCH /users/:id/role
   * @access Private (Admin only)
   */
  updateUserRole = asyncHandler(async (req, res) => {
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
    const { error, value } = updateRoleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const user = await userService.updateUserRole(req.params.id, value.role);

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user
      }
    });
  });

  /**
   * Update user status
   * @route PATCH /users/:id/status
   * @access Private (Admin only)
   */
  updateUserStatus = asyncHandler(async (req, res) => {
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
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const user = await userService.updateUserStatus(req.params.id, value.isActive);

    res.status(200).json({
      success: true,
      message: `User ${value.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });
  });

  /**
   * Delete user
   * @route DELETE /users/:id
   * @access Private (Admin only)
   */
  deleteUser = asyncHandler(async (req, res) => {
    // Validate params
    const { error } = userIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Prevent self-deletion
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  });
}

module.exports = new UserController();