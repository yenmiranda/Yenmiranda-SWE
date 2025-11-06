

-- 1. Classes Table (Independent)
-- Stores the list of subjects available for tutoring.
CREATE TABLE Classes (
    ClassNo VARCHAR(50) PRIMARY KEY, -- Subject identifier (e.g., 'CS101', 'HIST-B')
    ClassName VARCHAR(100) NOT NULL  -- Full name of the class
);

-- 2. Users Table
-- Stores all users (Student or Tutor) and defines the core RefNo.
CREATE TABLE Users (
    -- Primary Key: RefNo is a string concatenation of UserID and Role (e.g., '000877048-1')
    RefNo VARCHAR(60) PRIMARY KEY,
    
    -- The original unique User ID (SamID in the diagram)
    SamID VARCHAR(50) UNIQUE NOT NULL,
    
    -- Role: 0 = Student, 1 = Tutor (as per the diagram's 'Role(0,1)')
    Role INT NOT NULL CHECK (Role IN (0, 1)),
    
    
    FirstName VARCHAR(35) NOT NULL, 
    LastName VARCHAR(35) NOT NULL, 
    PasswordHash VARCHAR(255) NOT NULL,
    SecurityKey VARCHAR(5) NOT NULL
    
);

-- 3. Students Table
-- Represents the 'is a' relationship where a User is a Student.
-- Uses the RefNo as its primary key and foreign key to the Users table.
CREATE TABLE Students (
    StdRefNo VARCHAR(60) PRIMARY KEY, -- StudentRefNo
    
    -- Ensures this RefNo exists in the Users table
    FOREIGN KEY (StdRefNo) REFERENCES Users(RefNo)
);

-- 4. Tutors Table
-- Represents the 'is a' relationship where a User is a Tutor.
-- Also stores the ClassNo the tutor provides.
CREATE TABLE Tutors (
    TutorRefNo VARCHAR(60) PRIMARY KEY, -- TutorRefNo
    
    -- Ensures this RefNo exists in the Users table
    FOREIGN KEY (TutorRefNo) REFERENCES Users(RefNo),
    
    -- The specific class the tutor offers (from ERD)
    ClassNo VARCHAR(50) NOT NULL,
    
    -- Ensures ClassNo is a valid subject
    FOREIGN KEY (ClassNo) REFERENCES Classes(ClassNo)
);

-- 5. Avail Table (Availability)
-- Stores the time slots marked as available by a tutor.
CREATE TABLE Avail (
    -- Unique identifier for the availability slot
    AvailID INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Key linking to the Tutor who owns this slot
    TutorRefNo VARCHAR(60) NOT NULL,
    FOREIGN KEY (TutorRefNo) REFERENCES Tutors(TutorRefNo),
    
    -- The time and class for which the slot is offered
    TimeSlot DATETIME NOT NULL,
    ClassNo VARCHAR(50) NOT NULL,
    FOREIGN KEY (ClassNo) REFERENCES Classes(ClassNo),
    
    -- Status flag: TRUE if booked, FALSE if available (Note: Diagram used 'Is Booked?')
    IsBooked BOOLEAN DEFAULT FALSE,

    -- Constraint to prevent the same tutor from setting the exact same slot twice
    UNIQUE (TutorRefNo, TimeSlot, ClassNo)
);

-- 6. Bookings Table
-- Records the actual booking transaction.
CREATE TABLE Bookings (
    -- Primary Key: Unique Booking Number (as requested)
    BookingNo INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Key to the specific Avail slot that was taken
    -- This key is UNIQUE because an Avail slot should only appear in one active booking
    AvailID INT UNIQUE NOT NULL,  
    FOREIGN KEY (AvailID) REFERENCES Avail(AvailID), 
    
    -- Student who made the booking (using RefNo as FK, as requested)
    StdRefNo VARCHAR(60) NOT NULL,
    FOREIGN KEY (StdRefNo) REFERENCES Students(StdRefNo),

    -- Redundant fields from Avail, captured here as a snapshot for quick reference:
    TutorRefNo VARCHAR(60) NOT NULL,
    FOREIGN KEY (TutorRefNo) REFERENCES Tutors(TutorRefNo),
    
    ClassNo VARCHAR(50) NOT NULL,
    TimeSlot DATETIME NOT NULL
    

);
