import Chat from "../models/chat.js";

// Create a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            username: req.user.username,
        };

        const newChat = new Chat(chatData);
        await newChat.save();

        return res.json({
            success: true,
            message: "Chat created successfully.",
            chatId: newChat._id,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Get all chats for a user
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;

        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

        return res.json({
            success: true,
            chats,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Delete a chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;

        const result = await Chat.deleteOne({ _id: chatId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or not authorized",
            });
        }

        return res.json({
            success: true,
            message: "Chat deleted successfully.",
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
