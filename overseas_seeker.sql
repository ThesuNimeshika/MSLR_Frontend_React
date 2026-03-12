-- SQL for creating Overseas Seeker table
CREATE TABLE OVERSEAS_SEEKER (
    overseas_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    email VARCHAR2(150) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    password_salt VARCHAR2(255),
    gender VARCHAR2(20),
    receive_emails NUMBER(1) DEFAULT 0,
    cv_file_name VARCHAR2(255),
    cv_file_path VARCHAR2(500),
    is_verified NUMBER(1) DEFAULT 0,
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    sector_id VARCHAR2(100)
);
