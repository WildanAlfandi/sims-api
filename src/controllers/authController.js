const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { registrationSchema, loginSchema } = require('../utils/validation');

const register = async (req, res) => {
    try {
        // Validate input
        const { error } = registrationSchema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        const { email, first_name, last_name, password } = req.body;

        // Check if email already exists - USING RAW QUERY WITH PREPARED STATEMENT
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return errorResponse(res, 'Email sudah terdaftar', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user - USING RAW QUERY WITH PREPARED STATEMENT
        await db.query(
            'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
            [email, first_name, last_name, hashedPassword]
        );

        return successResponse(res, 'Registrasi berhasil silahkan login', null, 200);
    } catch (error) {
        console.error('Registration error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

const login = async (req, res) => {
    try {
        // Validate input
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        const { email, password } = req.body;

        // Get user - USING RAW QUERY WITH PREPARED STATEMENT
        const [users] = await db.query(
            'SELECT id, email, first_name, last_name, password FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return errorResponse(res, 'Username atau password salah', 401);
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorResponse(res, 'Username atau password salah', 401);
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
        );

        return successResponse(res, 'Login Sukses', { token }, 200);
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

module.exports = { register, login };