USE childcare_db;

INSERT INTO
    Facilities (
        facility_id,
        name,
        address,
        phone_number,
        license_number,
        admin_id
    )
VALUES
    (
        1,
        'Green Park Health Center',
        '123 Oak Street, Somewhereville',
        '555-0100',
        'ST 12345',
        1
    ),
    (
        2,
        'Sunshine Clinic',
        '456 Maple Avenue, Anytown, AT 67890',
        '555-0200',
        'LIC654321',
        2
    );

INSERT INTO
    Classrooms (
        classroom_id,
        classroom_type,
        capacity,
        tuition_fee,
        facility_id
    )
VALUES
    (11, 'Infant', 8, 1000.00, 1),
    (12, 'Toddler', 12, 1000.00, 1),
    (13, 'Twaddler', 16, 1000.00, 1),
    (14, '3 Years Old', 18, 1000.00, 1),
    (15, '4 Years Old', 20, 1000.00, 1),
    (16, 'Infant', 8, 1000.00, 2),
    (17, 'Toddler', 12, 1000.00, 2),
    (18, 'Twaddler', 16, 1000.00, 2),
    (19, '3 Years Old', 18, 1000.00, 2),
    (20, '4 Years Old', 20, 1000.00, 2);

INSERT INTO
    FacilityAdmins (
        admin_id,
        first_name,
        last_name,
        email,
        contact_number,
        password
    )
VALUES
    (
        1,
        'Alice',
        'Smith',
        'alice.smith@email.com',
        '555-1001',
        '1234'
    ),
    (
        2,
        'Bob',
        'Johnson',
        'bob.johnson@email.com',
        '555-1002',
        '1234'
    );

INSERT INTO
    Parents (
        parent_id,
        first_name,
        last_name,
        phone_number,
        address,
        email,
        password
    )
VALUES
    (
        1,
        'John',
        'Johnson',
        '555-2001',
        '123 Oak Street, Somewhereville',
        'john.johnson@email.com',
        ''
    ),
    (
        2,
        'James',
        'Miller',
        '555-2005',
        '654 Spruce Way, Lakecity',
        'james.miller@email.com',
        ''
    ),
    (
        3,
        'Mike',
        'Brown',
        '555-2003',
        '789 Birch Road, Rivertown',
        'mike.brown@email.com',
        ''
    ),
    (
        4,
        'Sarah',
        'Davis',
        '555-2004',
        '321 Pine Lane, Hillside',
        'sarah.davis@email.com',
        ''
    ),
    (
        5,
        'Jade',
        'Miller',
        '555-2005',
        '654 Spruce Way, Lakecity',
        'jade.miller@email.com',
        ''
    ),
    (
        6,
        'William',
        'Turner',
        '555-4001',
        '105 Greenway Blvd, Newville',
        'william.turner@email.com',
        ''
    ),
    (
        7,
        'Henry',
        'Lee',
        '555-4003',
        '654 Spruce Way, Lakecity',
        'henry.lee@email.com',
        ''
    ),
    (
        8,
        'Kim',
        'Nguyen',
        '555-2003',
        '789 Birch Road, Rivertown',
        'kim.nguyen@email.com',
        ''
    ),
    (
        9,
        'Carlos',
        'Hernandez',
        '555-2005',
        '654 Spruce Way, Lakecity',
        'carlos.hernandez@email.com',
        ''
    ),
    (
        10,
        'Elena',
        'Rodriguez',
        '555-2005',
        '654 Spruce Way, Lakecity',
        'elena.rodriguez@email.com',
        ''
    );

INSERT INTO
    Children (
        child_id,
        facility_id,
        first_name,
        last_name,
        DOB,
        child_type,
        allergies,
        parent_id,
        classroom_id,
        date_created
    )
VALUES
    (
        1,
        1,
        'Emma',
        'Johnson',
        '2021-06-15',
        'Infant',
        'None',
        1,
        11,
        '2023-01-28'
    ),
    (
        2,
        1,
        'Ava',
        'Miller',
        '2017-07-25',
        '4 Years Old',
        'None',
        2,
        15,
        '2023-02-28'
    ),
    (
        3,
        1,
        'Olivia',
        'Brown',
        '2019-09-30',
        'Twaddler',
        'None',
        3,
        13,
        '2023-03-28'
    ),
    (
        4,
        1,
        'Liam',
        'Davis',
        '2019-12-10',
        '3 Years Old',
        'None',
        4,
        14,
        '2023-04-28'
    ),
    (
        5,
        1,
        'Ava',
        'Miller',
        '2017-07-25',
        '4 Years Old',
        'None',
        5,
        15,
        '2023-05-28'
    ),
    (
        6,
        1,
        'Aiden',
        'Turner',
        '2022-01-05',
        'Infant',
        'None',
        6,
        11,
        '2023-06-28'
    ),
    (
        7,
        1,
        'Lucas',
        'Lee',
        '2019-09-30',
        'Infant',
        'None',
        7,
        11,
        '2023-07-28'
    ),
    (
        8,
        1,
        'Chloe',
        'Nguyen',
        '2022-04-20',
        'Infant',
        'None',
        8,
        11,
        '2023-08-28'
    ),
    (
        9,
        1,
        'Ethan',
        'Hernandez',
        '2017-07-25',
        'Infant',
        'None',
        9,
        11,
        '2023-09-28'
    ),
    (
        10,
        1,
        'Mia',
        'Rodriguez',
        '2022-02-10',
        'Infant',
        'None',
        10,
        11,
        '2023-10-28'
    );

INSERT INTO
    Teachers (
        teacher_id,
        first_name,
        last_name,
        DOB,
        address,
        phone_number,
        email,
        password,
        facility_id,
        classroom_id
    )
VALUES
    (
        1,
        'Emily',
        'Taylor',
        '1985-04-16',
        '678 Cedar Path, Harmonyville',
        '555-3001',
        'emily.taylor@email.com',
        '1234',
        1,
        11
    ),
    (
        2,
        'Jacob',
        'Anderson',
        '1988-07-22',
        '452 Oak Drive, Quiet Town',
        '555-3002',
        'jacob.anderson@email.com',
        '1234',
        1,
        13
    ),
    (
        3,
        'Sophia',
        'Harris',
        '1990-02-11',
        '219 Pine Street, Lakeview',
        '555-3003',
        'sophia.harris@email.com',
        '1234',
        1,
        14
    ),
    (
        4,
        'Michael',
        'Brown',
        '1986-11-30',
        '345 Birch Lane, Mountain Ridge',
        '555-3004',
        'michael.brown@email.com',
        '1234',
        1,
        15
    ),
    (
        5,
        'Isabella',
        'Wilson',
        '1992-05-14',
        '789 Maple Road, Sunnyville',
        '555-3005',
        'isabella.wilson@email.com',
        '1234',
        1,
        11
    );

INSERT INTO
    ChildAttendance (attendance_id, child_id, date, present)
VALUES
    (22, 6, '2023-11-28', 1),
    (23, 1, '2023-11-28', 1),
    (24, 7, '2023-11-28', 1),
    (25, 8, '2023-11-28', 1),
    (26, 9, '2023-11-28', 0),
    (27, 10, '2023-11-28', 0),
    (28, 3, '2023-11-28', 1);

INSERT INTO
    TeacherAttendance (
        attendance_id,
        teacher_id,
        date,
        hours_worked,
        start_time,
        end_time
    )
VALUES
    (5, 1, '2023-11-28', 8.00, '00:00:00', '08:00:00'),
    (
        6,
        2,
        '2023-11-28',
        12.07,
        '00:00:00',
        '12:04:00'
    ),
    (
        7,
        3,
        '2023-11-28',
        13.15,
        '00:00:00',
        '13:09:00'
    );

INSERT INTO
    ChildAttendance (child_id, date, present)
VALUES
    (1, '2023-10-28', 1),
    (1, '2023-10-29', 0),
    (1, '2023-10-30', 1),
    (1, '2023-10-31', 0),
    (1, '2023-11-01', 1),
    (1, '2023-11-02', 0),
    (1, '2023-11-03', 1),
    (1, '2023-11-04', 1),
    (1, '2023-11-05', 0),
    (1, '2023-11-06', 1),
    (1, '2023-11-07', 0),
    (1, '2023-11-08', 1),
    (1, '2023-11-09', 1),
    (1, '2023-11-10', 0),
    (1, '2023-11-11', 1),
    (1, '2023-11-12', 0),
    (1, '2023-11-13', 1),
    (1, '2023-11-14', 0),
    (1, '2023-11-15', 1),
    (1, '2023-11-16', 1),
    (1, '2023-11-17', 0),
    (1, '2023-11-18', 1),
    (1, '2023-11-19', 0),
    (1, '2023-11-20', 1),
    (1, '2023-11-21', 1),
    (1, '2023-11-22', 0),
    (1, '2023-11-23', 1),
    (1, '2023-11-24', 1),
    (1, '2023-11-25', 0),
    (1, '2023-11-26', 1),
    (1, '2023-11-27', 0),
    (1, '2023-11-28', 1);

-- Generate hardcoded data for teacher_id 1 from '2023-10-28' to '2023-11-28' in TeacherAttendance
INSERT INTO
    TeacherAttendance (
        teacher_id,
        date,
        hours_worked,
        start_time,
        end_time
    )
VALUES
    (1, '2023-10-28', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-10-29', 7.92, '00:00:00', '07:55:00'),
    (1, '2023-10-30', 7.98, '00:00:00', '07:58:00'),
    (1, '2023-10-31', 8.05, '00:00:00', '08:05:00'),
    (1, '2023-11-01', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-02', 7.95, '00:00:00', '07:57:00'),
    (1, '2023-11-03', 8.10, '00:00:00', '08:06:00'),
    (1, '2023-11-04', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-05', 7.92, '00:00:00', '07:55:00'),
    (1, '2023-11-06', 8.08, '00:00:00', '08:05:00'),
    (1, '2023-11-07', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-08', 7.93, '00:00:00', '07:56:00'),
    (1, '2023-11-09', 8.07, '00:00:00', '08:04:00'),
    (1, '2023-11-10', 7.98, '00:00:00', '07:58:00'),
    (1, '2023-11-11', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-12', 7.91, '00:00:00', '07:55:00'),
    (1, '2023-11-13', 8.10, '00:00:00', '08:06:00'),
    (1, '2023-11-14', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-15', 7.95, '00:00:00', '07:57:00'),
    (1, '2023-11-16', 8.05, '00:00:00', '08:03:00'),
    (1, '2023-11-17', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-18', 7.92, '00:00:00', '07:55:00'),
    (1, '2023-11-19', 8.08, '00:00:00', '08:05:00'),
    (1, '2023-11-20', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-21', 7.93, '00:00:00', '07:56:00'),
    (1, '2023-11-22', 8.07, '00:00:00', '08:04:00'),
    (1, '2023-11-23', 7.98, '00:00:00', '07:58:00'),
    (1, '2023-11-24', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-25', 7.92, '00:00:00', '07:55:00'),
    (1, '2023-11-26', 8.10, '00:00:00', '08:06:00'),
    (1, '2023-11-27', 8.00, '00:00:00', '08:00:00'),
    (1, '2023-11-28', 7.95, '00:00:00', '07:57:00');