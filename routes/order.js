const router = require("express").Router();
const {authenticateToken} = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order", authenticateToken, async (req, res ) => {
    try{
        const {id} = req.headers;
        const {order} = req.body;

        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id});
            const orderDataFromDb = await newOrder.save();

            //saving Order inthe user model 
            await User.findByIdAndUpadate(id, {
                $push : {orders:  orderDataFromDb._id},
            });
            // clering cart
            await User.findByIdAndUpadate(id, {
                $pull: {cart: orderData._id},
            });
        }
        return res.json({ status: "Success", message:"Order Placed Successfully",});
    } catch (error){
        consloe.log(error);
        return res.status(500).json({message: "An error ocurred"});
    }
})

//get order  history of particuler user 
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const ordersData = userData.orders?.reverse() || [];
        return res.json({
            status: "Success",
            data: ordersData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
//get all order --- admin 
router.get("/get-all-orders", authenticateToken, async (req, res ) => {
    try{
        const userData = await Order.find()
        .populate({
            path: "book",
        })
        .sort({ createdAt: -1 });
        return  res.json({
            status: "Success",
            data:"userData",
        });
    } catch (error){
        console.log(error)
        return res.status(500).json({message:" An error occurred"});
    }
});

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