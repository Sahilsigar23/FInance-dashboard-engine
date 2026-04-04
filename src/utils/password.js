const bcrypt = require('bcrypt');

/**
 * Hash a plain text password
 * @param {string} plainPassword - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (plainPassword) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(plainPassword, saltRounds);
};

/**
 * Compare plain text password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};