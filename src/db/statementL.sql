CREATE  TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password INTEGER 
)

INSERT INTO users(username,password)
VALUES ("Cole", 12345 )
    ("Cain", 43210),
    ("Kin", 06789);

 UPDATE users 
 SET username = "Cainan"
 WHERE username = "Cain"   

 DELETE FROM users
 WHERE  username = "Kin"

SELECT username FROM users
WHERE id = 43210

DROP TABLE users