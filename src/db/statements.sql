CREATE TABLE todolist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority INTEGER 
);

INSERT INTO todolist (name, priority)
VALUES 
    ('Training', 3),
    ('Eat', 2),
    ('Sleep', 1);

UPDATE todolist
SET name = 'Task' 
WHERE name = 'Training';

DELETE FROM todolist
WHERE name = 'Task';

SELECT name FROM todolist
WHERE id = 2;

DROP TABLE todolist;
