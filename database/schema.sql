USE sims_db;

-- Table: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: balances
CREATE TABLE balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: services
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(50) NOT NULL UNIQUE,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(255) DEFAULT NULL,
    service_tariff DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_code (service_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: banners
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    banner_name VARCHAR(100) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: transactions
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    transaction_type ENUM('TOPUP', 'PAYMENT') NOT NULL,
    service_code VARCHAR(50) DEFAULT NULL,
    service_name VARCHAR(100) DEFAULT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_code) REFERENCES services(service_code) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_invoice (invoice_number),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_created_on (created_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample services
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000.00),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000.00),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000.00),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000.00),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('PAKET_DATA', 'Paket Data', 'https://nutech-integrasi.app/dummy.jpg', 50000.00),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000.00),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000.00),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000.00),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000.00);

-- Insert sample banners
INSERT INTO banners (banner_name, banner_image, description) VALUES
('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- Trigger: Create balance when user is created
DELIMITER //
CREATE TRIGGER create_user_balance 
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO balances (user_id, balance) VALUES (NEW.id, 0.00);
END//
DELIMITER ;