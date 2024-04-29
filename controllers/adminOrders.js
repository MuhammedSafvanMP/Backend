import Orders from "../models/orders.js"



// admin order Details 

export const adminOrderDetails = async (req, res, next) => {
    try {
        const orders = await Orders.find();
        if(orders.length === 0) {
            return res.status(404).json({message: "No order Details"});
        }
        res.status(200).json(orders);

    } catch (error) {
       return next(error);   
    }
}