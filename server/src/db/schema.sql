IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'user'
  );
END

IF OBJECT_ID('dbo.Payments', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    stripePaymentIntentId NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NULL,
    email NVARCHAR(255) NULL,
    projectRef NVARCHAR(255) NULL,
    agreed DECIMAL(18,2) NULL,
    depositAmount DECIMAL(18,2) NULL,
    currency NVARCHAR(10) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    contactMessageId INT NULL,
    dateCreated DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
  );
END
IF OBJECT_ID('dbo.PasswordResets', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.PasswordResets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    token NVARCHAR(255) NOT NULL,
    expiresAt DATETIME2 NOT NULL,
    used BIT NOT NULL DEFAULT 0
  );
END
IF OBJECT_ID('dbo.Projects', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Projects (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NULL,
    imageURL NVARCHAR(1024) NULL,
    link NVARCHAR(1024) NULL
  );
END

IF OBJECT_ID('dbo.Testimonials', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Testimonials (
    id INT IDENTITY(1,1) PRIMARY KEY,
    clientName NVARCHAR(255) NOT NULL,
    feedback NVARCHAR(MAX) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5)
  );
END

IF OBJECT_ID('dbo.ContactMessages', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.ContactMessages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    phone NVARCHAR(100) NULL,
    company NVARCHAR(255) NULL,
    subject NVARCHAR(255) NULL,
    service NVARCHAR(100) NULL,
    budget NVARCHAR(50) NULL,
    timeline NVARCHAR(50) NULL,
    attachment NVARCHAR(1024) NULL,
    enquiryType NVARCHAR(50) NULL,
    dateSubmitted DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
  );
END

IF OBJECT_ID('dbo.Subscriptions', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Subscriptions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    dateSubscribed DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
  );
END


