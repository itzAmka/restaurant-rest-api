import bcrypt from 'bcryptjs';

/**
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {boolean} - Returns true if the passwords match and false if they don't
 */
export const comparePasswords = async (
	password: string,
	hashedPassword: string,
): Promise<boolean> => {
	let isMatch = false;

	try {
		isMatch = await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		return false;
	}

	if (!isMatch) {
		return false;
	}

	return isMatch;
};
