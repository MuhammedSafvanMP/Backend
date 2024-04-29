import stripe from "stripe";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import Orders from "../models/orders.js";

const stripeInstance = stripe(process.env.STRIPE_SECURITY_KEY);

// user payment

let paymentData = {};

export const payment = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId }).populate({
      path: "cart",
      populate: { path: "productId" },
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
          description: item.productId.description,
        },
        unit_amount: Math.round(item.productId.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://example.com/success", // Replace with actual success URL
      cancel_url: "https://example.com/cancel", // Replace with actual cancel URL
    });

    if (!session) {
      return res
        .status(500)
        .json({ message: "Error occurred while creating session" });
    }

    paymentData = {
      userId,
      user,
      session,
    };
    console.log(paymentData, "eoiiooi");
    res
      .status(200)
      .json({
        message: "Stripe payment session created successfully",
        url: session.url,
      });
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
};

// payment success

export const success = async (req, res, next) => {
  try {
    const { id, user, session } = paymentData;

    const userId = user._id;
    const cartItems = user.cart;

    // Extract product IDs from cart items
    const productItems = cartItems.map((item) => item.productId);

    // Create a new order
    const order = await Orders.create({
      userId: id,
      productId: productItems,
      orderId: session.id,
      paymentId: `demo ${Date.now()}`,
      totalPrice: session.amount_total / 100,
    });

    if (!order) {
      return res
        .status(500)
        .json({ message: "Error occurred while creating order" });
    }

    const orderId = order._id;

    // Update the user document
    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { orders: orderId },
        $set: { cart: [] },
      },
      { new: true }
    );

    if (!userUpdate) {
      return res.status(500).json({ message: "Failed to update user data" });
    }

    res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
};

//Payment Cancel

export const cancel = async (req, res) => {
  res.status(204).json({ message: "Payment canceled" });
};

//Order Details

export const OrederDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await UserSchema.findOne({ _id: userId }).populate("orders");
    // console.log("user",user)

    const orderedProducts = user.orders;

    if (orderedProducts.length === 0) {
      return res.status(404).json({
        message: "You don't have any product orders.",
        data: [],
      });
    }

    const orderedItems = await Orders.find({
      _id: { $in: orderedProducts },
    }).populate("products");

    res.status(200).json({
      message: "Ordered Products Details Found",
      data: orderedItems,
    });
  } catch (error) {
    return next(error);
  }
};
