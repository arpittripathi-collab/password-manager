-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Saved passwords table (per user)
CREATE TABLE saved_password (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    site VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
