const db = require('./db');
const bcrypt = require('bcrypt');

class User {
    constructor(firstName, surName, samID, role, refID = null) {
        this.firstName = firstName;
        this.surName = surName;
        this.samID = samID;
        this.role = role;   // "Tutor" or "Tutee"
        this.refID = refID;
        this.loggedIn = false;
        this.active = false;
    }

    // clickRegister: adds a new user to the database
    async clickRegister(hashedPassword, hashedSecurityKey) {
        try {
            let roleValue = (this.role === 'Tutor') ? 1 : 0;

            const refNo = `${this.samID}-${roleValue}`;
            this.refID = refNo;

            const sql = `
                INSERT INTO Users (RefNo, SamID, Role, FirstName, LastName, PasswordHash, SecurityKey)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            await db.execute(sql, [
                this.refID,         
                this.samID,         
                roleValue,          
                this.firstName,     
                this.surName,       
                hashedPassword,     
                hashedSecurityKey   
            ]);

            console.log("User registered:", this.firstName, this.role);
            return true;
        } catch (err) {
        console.error("Error in clickRegister:", err.message);
        throw err;
    }
    }

    async clickLogin(password) {
        try {
            const sql = 'SELECT * FROM Users WHERE SamID = ?';
            const [rows] = await db.execute(sql, [this.samID]);

            if (rows.length === 0) {
                console.log("User not found for SamID:", this.samID);
                return false;
            }

            const user = rows[0];
            
            const isMatch = await bcrypt.compare(password, user.PasswordHash);

            if (isMatch) {
                this.firstName = user.FirstName;
                this.surName = user.LastName;
                this.role = user.Role === 1 ? 'Tutor' : 'Tutee';
                this.refID = user.RefNo;
                this.loggedIn = true;
                this.active = true;

                console.log("Login successful for:", this.firstName, this.role);
                return true;
            } else {
                // Passwords do not match
                console.log("Invalid password for SamID:", this.samID);
                return false;
            }
        } catch (err) {
            console.error("Error in clickLogin:", err.message);
            return false;
        }
    }

    // logOut: marks user as logged out
    logOut() {
        this.loggedIn = false;
        this.active = false;
        console.log("User logged out:", this.firstName);
    }
}

module.exports = User;
