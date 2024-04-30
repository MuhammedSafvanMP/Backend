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


//Total Revenue Generated

export const status = async (req, res, next) => {
  try {
    const totalStats = await Orders.aggregate([
      {
        $group: {
          _id: null,
          totalProduct: { $sum: { $size: "$productId" } }, 
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    if (totalStats.length > 0) {
      res.status(200).json({ status: "Success", data: totalStats[0] });
    } else {
      res.status(200).json({
        status: "Success",
        data: { totalProduct: 0, totalRevenue: 0 }
      });
    }
  } catch (error) {
    return next(error);
  }
};
