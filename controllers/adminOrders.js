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

status:async(req,res)=>{
    const totalRevenue = await Orders.aggregate([ 
        {
          $group: {
            _id: null,
            totalProduct: { $sum: { $size: "$products" } },
            totalRevenue: { $sum: "$totalPrice" },
          }
        }
      ])
  
      if (totalRevenue.length > 0) {
        // You have results
        res.status(200).json({ 
            status: "Success", 
            data: totalRevenue[0] })
      } else {
        // No results found
        res
          .status(200)
          .json({
            status: "Success",
            data: { totalProduct: 0, 
                    totalRevenue: 0 
                }
             })
         }
    }