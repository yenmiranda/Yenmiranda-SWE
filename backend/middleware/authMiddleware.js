import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
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