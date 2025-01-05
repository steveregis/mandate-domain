-- schema.sql
CREATE TABLE MANDATE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id VARCHAR(255),
    status VARCHAR(255),
    valid_from DATE,
    valid_to DATE
);
