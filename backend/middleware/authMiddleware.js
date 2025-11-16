//middleware for jwt tokens

import jwt from 'jsonwebtoken';
import db from '../db.js';

//exports a protect constant for jwt authentication allowing us to protect methods
const protect = async (req, res, next) => { 
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const [rows] = await db.execute(
                'SELECT SessionVersion FROM Users WHERE RefNo = ?', 
                [decoded.refNo]
            );

            if (rows.length === 0) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found.' });
            }

            const dbVersion = rows[0].SessionVersion;

            if (decoded.sessionVersion !== dbVersion) {
                return res.status(401).json({ success: false, message: 'Not authorized, session expired.' });
            }
            
            req.user = decoded; 
            next(); 

        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Not authorized, no token.' });
    }
};

export { protect };