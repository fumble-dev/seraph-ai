import imagekit from "../configs/imagekit.js";
import openai from "../configs/openai.js";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import axios from 'axios'

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


export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user || user.credits < 2) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits. Please upgrade your plan.",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

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

    const encodedPrompt = encodeURIComponent(prompt);
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/seraphai/${Date.now()}.png?tr=w-800,h-800`;

    const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" });
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "seraphai",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    // Push assistant reply
    chat.messages.push(reply);

    // Save chat and deduct credits
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Error in imageMessageController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
