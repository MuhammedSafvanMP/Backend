import User from "../models/userModel.js";
import Cart from "../models/cart.js";
import Products from "../models/productsModel.js";


// Add to cart

export const addToCart = async (req, res, next) => {   
    try {
        const userId = req.params.userid;
        const productId = req.params.id;
        // Find user by ID
        const user = await User.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product already exists in the cart
        let cartItem = await Cart.findOne({ userId: user._id, productId: product._id });
        
        if (cartItem) {
            // If the product already exists, increment the quantity
            cartItem.quantity++;
            await cartItem.save();
            return res.status(200).json({ message: "Cart product incremented" });
        } else {
            // If the product doesn't exist, create a new cart item
            cartItem = await Cart.create({
                userId: user._id,
                productId: product._id,
                quantity: 1
            });
            // Add the cart item to the user's cart
            user.cart.push(cartItem._id);
            await user.save();
            return res.status(200).json({ message: "Product added to cart successfully" });
        }

        // Respond with success message
    } catch (error) {
        // Handle any errors
        return next(error);
    }
};



// view  product from cart    


export const viewCart = async (req, res, next) => {
    try {
        const {id} = req.params; 
        console.log(id, "id");
        const user = await User.findById(id)
        .populate({
            path: 'cart',
            populate: { path: 'productId'}
        });

        console.log(user, "user");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(!user.cart || user.cart.length === 0){
            return res.status(200).json({message: "User cart is empty", data: []});
        }

        res.status(200).json(user.cart);

    } catch (error) {
       return next(error);
    }
}

// Add cart quantity

export const incrementCartItemQuantity = async (req, res, next) => {
    try {
        const userId = req.params.userid;
        const productId = req.params.id;
        const  {quantityIncrement}  = req.body;  


        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create cart item
        let cartItem = await Cart.findOne({ userId: user._id, productId: product._id });
        if (cartItem) {
            // If the product already exists, increment the quantity
            if(typeof quantityIncrement !== "number"){
                return res.status(400).json({message: "Bad request"})
            }else{
                cartItem.quantity += quantityIncrement;
                await cartItem.save();

            }
        }

        res.status(201).json({ message: "Quantity incremented" });

    } catch (error) {
        console.error("Error:", error);
        return next(error);
    }
};


export const decrementCartItemQuantity = async (req, res, next) => {
    try {
        const userId = req.params.userid;
        const productId = req.params.id;
        const  {quantityDecrement}  = req.body;  


        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create cart item
        let cartItem = await Cart.findOne({ userId: user._id, productId: product._id });
        if (cartItem) {
            // If the product already exists, decrement the quantity
            if(typeof quantityDecrement !== "number"){
                return res.status(400).json({message: "Bad request"})
            }
            if(cartItem.quantity - quantityDecrement >= 0){
                cartItem.quantity -= quantityDecrement;
                await cartItem.save();
            }
            else{
                cartItem.quantity = 1
                await cartItem.save();
            }
            
        }
        res.status(201).json({ message: "Quantity decremented" });

    } catch (error) {
        console.error("Error:", error);
        return next(error);
    }
};

// Remove A cart 


export const removeCart = async (req, res, next) => {
    try {
        const { userId, itemId } = req.params;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Products.findById(itemId);
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        // Find and delete cart item for the specific user and product
        const cartItem = await Cart.findOneAndDelete({ userId: user._id, productId: product._id });

        if (!cartItem) {
            return res.status(400).json({ message: "Product not found in the user's cart" });
        }

        // Find the index of the cart item in the user's cartItems array
        const cartItemIndex = user.cart.findIndex(item => item.equals (cartItem._id));

        // If the cart item is found, remove it from the user's cartItems array
        if (cartItemIndex !== -1) {
            user.cart.splice(cartItemIndex, 1);
            await user.save();
        }

        return res.status(200).json({ message: "Product removed successfully" });

    } catch (error) {
        return next(error);
    }
};


