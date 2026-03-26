export const schema = `
CREATE TABLE IF NOT EXISTS weddings (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  partner1_name VARCHAR(255) NOT NULL,
  partner2_name VARCHAR(255) NOT NULL,
  date VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  venue VARCHAR(255),
  template VARCHAR(50) NOT NULL DEFAULT 'classic-garden',
  colors JSON,
  photo_url TEXT,
  story TEXT,
  menu JSON,
  program JSON,
  photos JSON,
  custom_domain VARCHAR(255),
  secret_token VARCHAR(64),
  stripe_session_id VARCHAR(255),
  stripe_mode VARCHAR(10) DEFAULT 'live',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  email VARCHAR(255) NOT NULL,
  language VARCHAR(5) DEFAULT 'es',
  palette VARCHAR(50) DEFAULT 'sage-cream',
  decorations VARCHAR(20) DEFAULT 'branches',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS guests (
  id VARCHAR(36) PRIMARY KEY,
  wedding_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  attending VARCHAR(20) DEFAULT 'pending',
  menu_choice VARCHAR(255),
  allergies TEXT,
  plus_one TINYINT DEFAULT 0,
  plus_one_name VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wedding_id) REFERENCES weddings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;
