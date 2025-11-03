const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user profile - USING RAW QUERY WITH PREPARED STATEMENT
        const [users] = await db.query(
            'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return errorResponse(res, 'User tidak ditemukan', 404);
        }

        return successResponse(res, 'Sukses', users[0], 200);
    } catch (error) {
        console.error('Get profile error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name } = req.body;

        if (!first_name || !last_name) {
            return errorResponse(res, 'First name dan last name harus diisi', 400);
        }

        // Update profile - USING RAW QUERY WITH PREPARED STATEMENT
        await db.query(
            'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
            [first_name, last_name, userId]
        );

        // Get updated profile
        const [users] = await db.query(
            'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
            [userId]
        );

        return successResponse(res, 'Update Profile berhasil', users[0], 200);
    } catch (error) {
        console.error('Update profile error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

const updateProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return errorResponse(res, 'File harus diupload', 400);
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Update profile image - USING RAW QUERY WITH PREPARED STATEMENT
        await db.query(
            'UPDATE users SET profile_image = ? WHERE id = ?',
            [imageUrl, userId]
        );

        // Get updated profile
        const [users] = await db.query(
            'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
            [userId]
        );

        return successResponse(res, 'Update Profile Image berhasil', users[0], 200);
    } catch (error) {
        console.error('Update profile image error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

module.exports = { getProfile, updateProfile, updateProfileImage };