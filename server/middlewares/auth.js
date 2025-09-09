import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || 'iloveyou';

export const protect = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login.",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
