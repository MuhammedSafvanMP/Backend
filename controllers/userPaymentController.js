import stripe from "stripe";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config()

const stripeInstance = stripe(process.env.STRIPE_SECURITY_KEY);

export const payment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).populate({
            path: 'cart',
            populate: { path: 'productId' }
        });

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartProducts = user.cart;

        if (cartProducts.length === 0) {
            return res.status(200).json({ message: "User cart is empty" });
        }

        const lineItems = cartProducts.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.productId.title,
                    description: item.productId.description
                },
                unit_amount: Math.round(item.productId.price * 100)
            },
            quantity: 1
        }));

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "https://example.com/success", // Replace with actual success URL
            cancel_url: "https://example.com/cancel"    // Replace with actual cancel URL
        });

        if (!session) {
            return res.status(500).json({ message: "Error occurred while creating session" });
        }

        const paymentData = {
            id: user._id, // Assuming id refers to the user's MongoDB _id
            user,
            session
        };

        res.status(200).json({ message: "Stripe payment session created successfully", url: session.url });
    } catch (error) {
        console.error("Error:", error);
        return next(error);
    }
};
