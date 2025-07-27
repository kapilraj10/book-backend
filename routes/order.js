const router = require("express").Router();
const {authenticateToken} = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      // Save new order
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      // Update user: add order ID and remove item from cart in one update call
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
        $pull: { cart: orderData._id },
      });
    }

    return res.json({ status: "Success", message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get order  history of particuler user 
router.get("/api/v1/get-order-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await User.findById(userId).populate({
      path: 'orders',
      populate: { path: 'book' }
    });

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const ordersData = userData.orders?.reverse() || [];

    return res.json({ success: true, data: ordersData });
  } catch (error) {
    console.error('Order history fetch error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
//get all order --- admin 

// update  order -- admin 
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpadate(id, {status: req.body.status});
        return res.json({
            status:" Success",
            message:"Status Update Successfully",
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({message:" An error occurred"});
    }
})
module.exports = router;