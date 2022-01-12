CREATE DATABASE IF NOT EXISTS lloa_turismo;

USE lloa_turismo;

--INSERS TABLE
CREATE TABLE users (
    id INT (11)NOT NULL, 
    user_name VARCHAR(16) NOT NULL;
    password VARCHAR(20) NOT NULL;
    first_name VARCHAR(100) NOT NULL;
    second_name VARCHAR(100) NOT NULL;
    user_email VARCHAR(100) NOT NULL;
    create_at timestamp NOT NULL DEFAULT current_timestamp
);

--ALTER TABLE ADD PRIMARY KEY
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE users MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
DESCRIBE users