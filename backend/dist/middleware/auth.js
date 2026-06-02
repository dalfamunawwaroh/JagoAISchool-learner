import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'jagoai_school_neural_secret_key_2026';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token is missing or invalid' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Access token has expired or is invalid' });
    }
};
