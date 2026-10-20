PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE site_content (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_by TEXT,
      updated_at INTEGER NOT NULL
    );