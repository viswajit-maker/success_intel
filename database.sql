CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Student', 'Teacher', 'Admin', 'Parent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    department VARCHAR(100) NOT NULL,
    enrollment_year INTEGER NOT NULL
);

CREATE TABLE academic_records (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    term VARCHAR(50) NOT NULL,
    attendance_percentage DECIMAL(5,2) NOT NULL,
    average_marks DECIMAL(5,2) NOT NULL,
    assignment_completion_rate DECIMAL(5,2) NOT NULL,
    participation_score DECIMAL(5,2) NOT NULL,
    ssis_score DECIMAL(5,2),
    risk_level VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    alert_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_academic_student ON academic_records(student_id);
CREATE INDEX idx_alerts_student ON alerts(student_id);
