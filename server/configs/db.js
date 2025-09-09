import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDb;
