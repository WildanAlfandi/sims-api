const Joi = require('joi');

const registrationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Parameter email tidak sesuai format',
        'any.required': 'Email harus diisi'
    }),
    first_name: Joi.string().required().messages({
        'any.required': 'First name harus diisi'
    }),
    last_name: Joi.string().required().messages({
        'any.required': 'Last name harus diisi'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password minimal 8 karakter',
        'any.required': 'Password harus diisi'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Parameter email tidak sesuai format',
        'any.required': 'Email harus diisi'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password harus diisi'
    })
});

const topupSchema = Joi.object({
    top_up_amount: Joi.number().positive().required().messages({
        'number.positive': 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        'any.required': 'Top up amount harus diisi'
    })
});

const transactionSchema = Joi.object({
    service_code: Joi.string().required().messages({
        'any.required': 'Service code harus diisi'
    })
});

module.exports = {
    registrationSchema,
    loginSchema,
    topupSchema,
    transactionSchema
};