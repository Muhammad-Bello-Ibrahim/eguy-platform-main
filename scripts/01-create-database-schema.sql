-- eGuy Platform Database Schema
-- MongoDB-like structure represented in SQL for reference

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  referred_by VARCHAR(255),
  kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  status ENUM('active', 'suspended', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referred_by) REFERENCES users(id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type ENUM('deposit', 'withdrawal', 'transfer', 'payment', 'referral_bonus') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  reference VARCHAR(255) UNIQUE,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Referral system table
CREATE TABLE IF NOT EXISTS referrals (
  id VARCHAR(255) PRIMARY KEY,
  referrer_id VARCHAR(255) NOT NULL,
  referred_id VARCHAR(255) NOT NULL,
  level INT NOT NULL DEFAULT 1,
  bonus_amount DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('active', 'completed', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referred_id) REFERENCES users(id)
);

-- Subscription packs table
CREATE TABLE IF NOT EXISTS subscription_packs (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  benefits JSON,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  pack_id VARCHAR(255) NOT NULL,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pack_id) REFERENCES subscription_packs(id)
);

-- Bill payments table
CREATE TABLE IF NOT EXISTS bill_payments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  service_type ENUM('airtime', 'data', 'electricity', 'water', 'tv', 'education') NOT NULL,
  provider VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  reference VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default subscription packs
INSERT INTO subscription_packs (id, name, price, description, benefits) VALUES
('basic-pack', 'Basic Pack', 3000.00, 'Entry level pack to start earning referral bonuses', 
 JSON_OBJECT('max_referrals', 10, 'level_1_bonus', 200, 'level_2_bonus', 150, 'level_3_bonus', 100, 'level_4_bonus', 50, 'level_5_bonus', 50)),
('growth-pack', 'Growth Pack', 5000.00, 'Enhanced earning potential with higher bonuses', 
 JSON_OBJECT('max_referrals', 20, 'level_1_bonus', 300, 'level_2_bonus', 200, 'level_3_bonus', 150, 'level_4_bonus', 100, 'level_5_bonus', 75)),
('expansion-pack', 'Expansion Pack', 10000.00, 'Scale your referral network with premium benefits', 
 JSON_OBJECT('max_referrals', 50, 'level_1_bonus', 500, 'level_2_bonus', 350, 'level_3_bonus', 250, 'level_4_bonus', 150, 'level_5_bonus', 100)),
('premium-pack', 'Premium Pack', 20000.00, 'Maximum earning potential for serious networkers', 
 JSON_OBJECT('max_referrals', 100, 'level_1_bonus', 800, 'level_2_bonus', 600, 'level_3_bonus', 400, 'level_4_bonus', 250, 'level_5_bonus', 150)),
('pinnacle-pack', 'Pinnacle Pack', 50000.00, 'Ultimate package for top-tier earners', 
 JSON_OBJECT('max_referrals', 200, 'level_1_bonus', 1500, 'level_2_bonus', 1000, 'level_3_bonus', 750, 'level_4_bonus', 500, 'level_5_bonus', 300));
