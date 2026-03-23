export const schema = `
CREATE TABLE IF NOT EXISTS weddings (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  partner1_name TEXT NOT NULL,
  partner2_name TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  venue TEXT,
  template TEXT NOT NULL DEFAULT 'classic',
  colors TEXT NOT NULL DEFAULT '{"primary":"#7A8B5E","secondary":"#C4A35A","bg":"#FDFBF7","text":"#2C3E2D"}',
  photo_url TEXT,
  story TEXT,
  menu TEXT,
  program TEXT,
  custom_domain TEXT,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL REFERENCES weddings(id),
  name TEXT NOT NULL,
  email TEXT,
  attending TEXT DEFAULT 'pending',
  menu_choice TEXT,
  allergies TEXT,
  plus_one INTEGER DEFAULT 0,
  plus_one_name TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;
