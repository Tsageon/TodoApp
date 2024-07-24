CREATE TABLE registar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  confirm_password TEXT NOT NULL
);

INSERT INTO registar(firstname,lastname,email,password,confirm_password)
VALUES ("Cee","Ds","Nuts@gmail.com","3214","3214")

UPDATE registar
SET firstname = "C"
WHERE firstname = "Cee"

DELETE FROM registar 
WHERE firstname = "C"

SELECT * FROM registar 
WHERE id = 1

DROP TABLE registar

PRAGMA table_info(registar);
SELECT * FROM registar;
