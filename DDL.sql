CREATE DATABASE childcare_db;

USE childcare_db;

-- Facilities Table
CREATE TABLE Facilities (
    facility_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    license_number VARCHAR(255) NOT NULL
);

-- FacilityAdmins Table
CREATE TABLE FacilityAdmins (
    admin_id INT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL
);

ALTER TABLE
    Facilities
ADD
    admin_id INT,
ADD
    FOREIGN KEY (admin_id) REFERENCES FacilityAdmins(admin_id);

CREATE TABLE Teachers (
    teacher_id INT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    DOB DATE NOT NULL,
    address VARCHAR(500) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    hourly_salary DECIMAL(10, 2) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    facility_id INT,
    FOREIGN KEY (facility_id) REFERENCES Facilities(facility_id)
);

CREATE TABLE Classrooms (
    classroom_id INT PRIMARY KEY,
    classroom_type ENUM(
        'Infant',
        'Toddler',
        'Twaddler',
        '3 Years Old',
        '4 Years Old'
    ) NOT NULL,
    capacity INT NOT NULL,
    tuition_fee DECIMAL(10, 2) NOT NULL,
    facility_id INT,
    FOREIGN KEY (facility_id) REFERENCES Facilities(facility_id)
);

CREATE TABLE Parents (
    parent_id INT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(500) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE Children (
    child_id INT PRIMARY KEY,
    facility_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    DOB DATE NOT NULL,
    child_type ENUM(
        'Infant',
        'Toddler',
        'Twaddler',
        '3 Years Old',
        '4 Years Old'
    ) NOT NULL,
    allergies TEXT,
    parent_id INT,
    classroom_id INT,
    FOREIGN KEY (parent_id) REFERENCES Parents(parent_id),
    FOREIGN KEY (classroom_id) REFERENCES Classrooms(classroom_id)
);

ALTER TABLE
    Children DROP FOREIGN KEY Children_ibfk_2;

ALTER TABLE
    Classrooms
MODIFY
    COLUMN classroom_id INT AUTO_INCREMENT;

ALTER TABLE
    Children
ADD
    CONSTRAINT Children_ibfk_2 FOREIGN KEY (classroom_id) REFERENCES Classrooms(classroom_id);

ALTER TABLE
    Teachers
MODIFY
    COLUMN hourly_salary INT;

ALTER TABLE
    Teachers
ADD
    COLUMN classroom_id INT;

ALTER TABLE
    Teachers
MODIFY
    COLUMN classroom_id INT NULL;

ALTER TABLE
    Teachers
ADD
    FOREIGN KEY (classroom_id) REFERENCES Classrooms(classroom_id);

ALTER TABLE
    Children
ADD
    date_created DATE;

DELIMITER / / CREATE TRIGGER set_date_created BEFORE
INSERT
    ON Children FOR EACH ROW
SET
    NEW.date_created = CURDATE();

DELIMITER;

CREATE TABLE Ledgers (
    ledger_id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Paid', 'Unpaid') NOT NULL DEFAULT 'Unpaid',
    FOREIGN KEY (child_id) REFERENCES Children(child_id)
);

ALTER TABLE
    Ledgers
ADD
    COLUMN week_number INT NOT NULL;

CREATE TABLE ChildAttendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    date DATE NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (child_id) REFERENCES Children(child_id)
);

CREATE TABLE TeacherAttendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    date DATE NOT NULL,
    hours_worked DECIMAL(5, 2) DEFAULT 0,
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id)
);

ALTER TABLE
    TeacherAttendance
ADD
    COLUMN start_time INT;

ALTER TABLE
    TeacherAttendance
ADD
    COLUMN end_time INT;