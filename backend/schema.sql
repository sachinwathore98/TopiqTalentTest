CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Franchise Table
CREATE TABLE franchises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_code VARCHAR(20) UNIQUE NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    office_address TEXT,
    office_sqft INT DEFAULT 150,
    active_students_count INT DEFAULT 0,
    revenue_share_percentage NUMERIC(5,2) DEFAULT 40.00,
    status VARCHAR(30) DEFAULT 'INQUIRY_PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TYPE student_group AS ENUM ('GROUP_A', 'GROUP_B', 'GROUP_C', 'GROUP_D', 'GROUP_E');

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topiq_roll_number VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    guardian_phone VARCHAR(15) NOT NULL,
    email VARCHAR(150),
    school_or_college VARCHAR(255) NOT NULL,
    grade_category VARCHAR(50) NOT NULL,
    learning_group student_group NOT NULL,
    district VARCHAR(100) NOT NULL,
    assigned_franchise_id UUID REFERENCES franchises(id) ON DELETE SET NULL,
    current_streak INT DEFAULT 0,
    total_score NUMERIC(8,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE admission_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    franchise_id UUID REFERENCES franchises(id) ON DELETE SET NULL,
    amount_paid NUMERIC(10,2) NOT NULL,
    franchise_share_amount NUMERIC(10,2) NOT NULL,
    company_share_amount NUMERIC(10,2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);