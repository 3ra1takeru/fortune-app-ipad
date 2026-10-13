PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  birthdate TEXT NOT NULL,
  gender TEXT NOT NULL,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "customers" ("id","name","birthdate","gender","notes","createdAt","updatedAt") VALUES(6,'タケル','1986-04-25','male','','2026-10-10 19:51:58','2026-10-11 12:01:33');
INSERT INTO "customers" ("id","name","birthdate","gender","notes","createdAt","updatedAt") VALUES(8,'愛','1988-12-11','female','','2026-10-11 01:44:23','2026-10-11 01:44:23');
INSERT INTO "customers" ("id","name","birthdate","gender","notes","createdAt","updatedAt") VALUES(9,'颯一郎','2013-06-23','male','','2026-10-11 01:54:17','2026-10-11 01:54:17');
CREATE TABLE records (
  id TEXT PRIMARY KEY,
  customerId INTEGER NOT NULL,
  date DATETIME NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  postMessage TEXT,
  partnerName TEXT,
  FOREIGN KEY (customerId) REFERENCES customers (id) ON DELETE CASCADE
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('customers',16);
