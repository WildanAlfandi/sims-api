const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getBanner = async (req, res) => {
    try {
        // Get all banners - USING RAW QUERY WITH PREPARED STATEMENT
        const [banners] = await db.query(
            'SELECT banner_name, banner_image, description FROM banners ORDER BY id',
            []
        );

        return successResponse(res, 'Sukses', banners, 200);
    } catch (error) {
        console.error('Get banner error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

const getServices = async (req, res) => {
    try {
        // Get all services - USING RAW QUERY WITH PREPARED STATEMENT
        const [services] = await db.query(
            'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id',
            []
        );

        const formattedServices = services.map(s => ({
            service_code: s.service_code,
            service_name: s.service_name,
            service_icon: s.service_icon,
            service_tariff: parseFloat(s.service_tariff)
        }));

        return successResponse(res, 'Sukses', formattedServices, 200);
    } catch (error) {
        console.error('Get services error:', error);
        return errorResponse(res, 'Terjadi kesalahan pada server', 500);
    }
};

module.exports = { getBanner, getServices };