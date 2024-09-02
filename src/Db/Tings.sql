CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  userId INTEGER,
  FOREIGN KEY(userId) REFERENCES user(id)
);

INSERT INTO user (firstname, lastname, email, password) VALUES
  ('John', 'Doe', 'john.doe@example.com', 'password123'),
  ('Jane', 'Smith', 'jane.smith@example.com', 'password456');


INSERT INTO task (description, priority, userId) VALUES
  ('Complete React project', 'High', 1),
  ('Review SQL schema', 'Medium', 2);

ALTER TABLE task ADD COLUMN dueDate TEXT;

SELECT * FROM user WHERE email = 'test@example.com';
