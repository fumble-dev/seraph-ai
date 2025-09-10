import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Chat from "../models/chat.js";

const JWT_SECRET = process.env.JWT_SECRET || 'iloveyou';

export const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email and password.",
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please login.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.status(201).json({
            success: true,
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.status(200).json({
            success: true,
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.json({
            success: true,
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
}

export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          username: "$username",
          timestamp: "$messages.timestamp",
        },
      },
      { $sort: { timestamp: -1 } }, // newest first
    ]);

    res.json({
      success: true,
      images: publishedImageMessages,
    });
  } catch (error) {
    console.error("Error in getPublishedImages:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
