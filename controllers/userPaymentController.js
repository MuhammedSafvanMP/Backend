import stripe from "stripe";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import Orders from "../models/orders.js";
import Cart from "../models/cart.js";
const stripeInstance = stripe(process.env.STRIPE_SECURITY_KEY);

// user payment

let Svalue = {};

export const payment = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({
      path: "cart",
      populate: { path: "productId" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartProducts = user.cart;

    if (cartProducts.length === 0) {
      return res.status(200).json({ message: "User cart is empty" });
    }

    let totalAmount = 0;
    let totalQuantity = 0;

    const lineItems = cartProducts.map((item) => {
      totalAmount += item.productId.price * item.quantity;
      totalQuantity += item.quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId.title,
            description: item.productId.description,
          },
          unit_amount: Math.round(item.productId.price * 100),
        },
        quantity: item.quantity,
      };
    });

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

    Svalue = {
      userId,
      user,
      session,
    };

    //  await Cart.findByIdAndDelete(user.cart._id)    


    res.status(200).json({
      message: "Stripe payment session created successfully",
      url: session.url,
      totalAmount,
      totalQuantity,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
};


// payment success



export const success = async (req, res, next) => {
  try {
    const { userId, user, session } = Svalue;

    const cartItems = user.cart;
    const productItems = cartItems.map((item) => item.productId._id.toString());

    const order = await Orders.create({
      userId: userId,
      productId: productItems,
      orderId: session.id,
      paymentId: `demo ${Date.now()}`,
      totalPrice: session.amount_total / 100,
    });

    const orderId = order._id;

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

    // Remove all items from user's cart after successful payment
    await Cart.deleteMany({ _id: { $in: cartItems.map(item => item._id) } });

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


export const OrderDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;

        const user = await User.findById(userId).populate({
            path: 'orders',
            populate: { path: 'productId' }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.orders || user.orders.length === 0) {
            return res.status(200).json({ message: "User order is empty", data: [] });
        }

        res.status(200).json(user.orders);
  } catch (error) {
    return next(error);
  }
};


