const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { topupSchema, transactionSchema } = require('../utils/validation');

const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get balance - USING RAW QUERY WITH PREPARED STATEMENT
        const [balances] = await db.query(
            'SELECT balance FROM balances WHERE user_id = ?',
            [userId]
        );

        const balance = balances.length > 0 ? parseFloat(balances[0].balance) : 0;

        return successResponse(res, 'Get Balance Berhasil', { balance }, 200);
    } catch (error) {
        console.error('Get balance error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

const topUp = async (req, res) => {
    const connection = await db.getConnection();
    try {
        // Validate input
        const { error } = topupSchema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        const userId = req.user.id;
        const { top_up_amount } = req.body;

        await connection.beginTransaction();

        // Generate invoice number
        const invoiceNumber = `INV${Date.now()}-${userId}`;

        // Insert transaction - USING RAW QUERY WITH PREPARED STATEMENT
        await connection.query(
            'INSERT INTO transactions (user_id, invoice_number, transaction_type, total_amount, description) VALUES (?, ?, ?, ?, ?)',
            [userId, invoiceNumber, 'TOPUP', top_up_amount, 'Top Up balance']
        );

        // Update balance - USING RAW QUERY WITH PREPARED STATEMENT
        await connection.query(
            'UPDATE balances SET balance = balance + ? WHERE user_id = ?',
            [top_up_amount, userId]
        );

        await connection.commit();

        // Get updated balance
        const [balances] = await connection.query(
            'SELECT balance FROM balances WHERE user_id = ?',
            [userId]
        );

        const newBalance = parseFloat(balances[0].balance);

        return successResponse(res, 'Top Up Balance berhasil', { balance: newBalance }, 200);
    } catch (error) {
        await connection.rollback();
        console.error('Top up error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    } finally {
        connection.release();
    }
};

const transaction = async (req, res) => {
    const connection = await db.getConnection();
    try {
        // Validate input
        const { error } = transactionSchema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }

        const userId = req.user.id;
        const { service_code } = req.body;

        await connection.beginTransaction();

        // Get service - USING RAW QUERY WITH PREPARED STATEMENT
        const [services] = await connection.query(
            'SELECT service_code, service_name, service_tariff FROM services WHERE service_code = ?',
            [service_code]
        );

        if (services.length === 0) {
            await connection.rollback();
            return errorResponse(res, 'Service atau Layanan tidak ditemukan', 400);
        }

        const service = services[0];
        const amount = parseFloat(service.service_tariff);

        // Check balance - USING RAW QUERY WITH PREPARED STATEMENT
        const [balances] = await connection.query(
            'SELECT balance FROM balances WHERE user_id = ?',
            [userId]
        );

        const currentBalance = parseFloat(balances[0].balance);

        if (currentBalance < amount) {
            await connection.rollback();
            return errorResponse(res, 'Saldo tidak mencukupi', 400);
        }

        // Generate invoice number
        const invoiceNumber = `INV${Date.now()}-${userId}`;

        // Insert transaction - USING RAW QUERY WITH PREPARED STATEMENT
        await connection.query(
            'INSERT INTO transactions (user_id, invoice_number, transaction_type, service_code, service_name, total_amount, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, invoiceNumber, 'PAYMENT', service_code, service.service_name, amount, `Payment for ${service.service_name}`]
        );

        // Update balance - USING RAW QUERY WITH PREPARED STATEMENT
        await connection.query(
            'UPDATE balances SET balance = balance - ? WHERE user_id = ?',
            [amount, userId]
        );

        await connection.commit();

        return successResponse(res, 'Transaksi berhasil', {
            invoice_number: invoiceNumber,
            service_code: service_code,
            service_name: service.service_name,
            transaction_type: 'PAYMENT',
            total_amount: amount,
            created_on: new Date().toISOString()
        }, 200);
    } catch (error) {
        await connection.rollback();
        console.error('Transaction error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    } finally {
        connection.release();
    }
};

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        // Get transaction history - USING RAW QUERY WITH PREPARED STATEMENT
        const [transactions] = await db.query(
            `SELECT invoice_number, transaction_type, service_code, service_name, 
                    total_amount, created_on as created_on, description
             FROM transactions 
             WHERE user_id = ? 
             ORDER BY created_on DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        const records = transactions.map(t => ({
            invoice_number: t.invoice_number,
            transaction_type: t.transaction_type,
            description: t.description,
            total_amount: parseFloat(t.total_amount),
            created_on: t.created_on
        }));

        return successResponse(res, 'Get History Berhasil', {
            offset,
            limit,
            records
        }, 200);
    } catch (error) {
        console.error('Get transaction history error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

module.exports = { getBalance, topUp, transaction, getTransactionHistory };