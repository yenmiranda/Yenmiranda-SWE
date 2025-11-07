const db = require('../db');

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
    async clickRegister(password, securityKey) {
        try {
            let roleValue;
            if (this.role === 'Tutor') {
                roleValue = 1;
            } else {
                roleValue = 0;
            }

            const sql = `
                INSERT INTO Users (SamID, Role, FirstName, LastName, PasswordHash, SecurityKey)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            await db.execute(sql, [
                this.samID,
                roleValue,
                this.firstName,
                this.surName,
                password,
                securityKey
            ]);

            console.log("User registered:", this.firstName, this.role);
            return true;
        } catch (err) {
            console.error("Error in clickRegister:", err.message);
            return false;
        }
    }

    // clickLogin: checks credentials and sets login status
    async clickLogin(password) {
        try {
            const sql = 'SELECT * FROM Users WHERE SamID = ? AND PasswordHash = ?';
            const [rows] = await db.execute(sql, [this.samID, password]);

            if (rows.length === 0) {
                console.log("Invalid login for SamID:", this.samID);
                return false;
            }

            const user = rows[0];
            this.firstName = user.FirstName;
            this.surName = user.LastName;
            this.role = user.Role === 1 ? 'Tutor' : 'Tutee';
            this.refID = user.RefNo;
            this.loggedIn = true;
            this.active = true;

            console.log("Login successful for:", this.firstName, this.role);
            return true;
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
