import bcrypt from 'bcryptjs';

/**
 * @param {string} password  - The plain text password
 * @returns {string} hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
	try {
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (error) {
		throw new Error('Failed to hash password');
	}
};
