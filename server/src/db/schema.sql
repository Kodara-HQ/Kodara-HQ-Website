-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
);

-- Create Payments table
CREATE TABLE IF NOT EXISTS Payments (
  id SERIAL PRIMARY KEY,
  stripePaymentIntentId VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  projectRef VARCHAR(255),
  agreed DECIMAL(18,2),
  depositAmount DECIMAL(18,2),
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(50) NOT NULL,
  contactMessageId INTEGER,
  dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PasswordResets table
CREATE TABLE IF NOT EXISTS PasswordResets (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS Projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  imageURL VARCHAR(1024),
  link VARCHAR(1024)
);

-- Create Testimonials table
CREATE TABLE IF NOT EXISTS Testimonials (
  id SERIAL PRIMARY KEY,
  clientName VARCHAR(255) NOT NULL,
  feedback TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5)
);

-- Create ContactMessages table
CREATE TABLE IF NOT EXISTS ContactMessages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  phone VARCHAR(100),
  company VARCHAR(255),
  subject VARCHAR(255),
  service VARCHAR(100),
  budget VARCHAR(50),
  timeline VARCHAR(50),
  attachment VARCHAR(1024),
  enquiryType VARCHAR(50),
  dateSubmitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Subscriptions table
CREATE TABLE IF NOT EXISTS Subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  dateSubscribed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
