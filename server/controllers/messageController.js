import openai from "../configs/openai.js";
import Chat from "../models/chat.js";
import User from "../models/user.js";

export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { prompt, chatId } = req.body;

        const user = await User.findById(userId);
        if (!user || user.credits <= 0) {
            return res.status(403).json({
                success: false,
                message: "Not enough credits. Please upgrade your plan.",
            });
        }

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Invalid Chat Id.",
            });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
        });

        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user", content: prompt
            },],
        });

        const reply = {
            role: response.choices[0].message.role,
            content: response.choices[0].message.content,
            timestamp: Date.now(),
            isImage: false,
        };

        chat.messages.push(reply);

        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        return res.json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error("Error in textMessageController:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};


