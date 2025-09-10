import razorpay from "../configs/razorpay.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

const plans = [
    {
        id: "basic",
        name: "Basic",
        price: 1000,
        credits: 100,
        features: [
            "100 text generations",
            "50 image generations",
            "Standard support",
            "Access to basic models",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 2000,
        credits: 500,
        features: [
            "500 text generations",
            "200 image generations",
            "Priority support",
            "Access to pro models",
            "Faster response time",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        price: 3000,
        credits: 1000,
        features: [
            "1000 text generations",
            "500 image generations",
            "24/7 VIP support",
            "Access to premium models",
            "Dedicated account manager",
        ],
    },
];

export const getPlans = async (req, res) => {
    try {
        res.json({
            success: true,
            data: { plans },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};


export const purchasePlan = async (req, res) => {
    try {
        const { planId } = req.body;

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user._id;

        const plan = plans.find((p) => p.id === planId);
        if (!plan) {
            return res.status(400).json({ success: false, message: "Invalid Plan" });
        }

        const transaction = new Transaction({
            userId,
            planId: plan.id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false,
        });
        await transaction.save()

        const options = {
            amount: plan.price * 100,
            currency: process.env.CURRENCY || "INR",
            receipt: transaction._id.toString(),
        };


        const order = await razorpay.orders.create(options);

        return res.json({
            success: true,
            order,
            transactionId: transaction._id,
        });
    } catch (error) {
        console.error("purchasePlan error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const verifyPurchase = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const orderInfo = await razorpay.orders.fetch(razorpay_order_id);

        if (orderInfo.status === "paid") {
            const transaction = await Transaction.findById(orderInfo.receipt);

            if (!transaction) {
                return res.status(404).json({ success: false, message: "Transaction not found" });
            }

            if (transaction.isPaid) {
                return res.json({ success: true, message: "Payment already verified" });
            }

            transaction.isPaid = true;
            await transaction.save();

            await User.findByIdAndUpdate(transaction.userId, { $inc: { credits: transaction.credits } });

            return res.json({
                success: true,
                message: "Payment Successful.",
                order: orderInfo,
            });
        } else {
            return res.json({
                success: false,
                message: "Payment Failed.",
            });
        }
    } catch (error) {
        console.error("verifyPurchase error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};




