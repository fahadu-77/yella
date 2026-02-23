import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["customer", "staff", "delivery"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ 
      msg: `User role updated to ${role}`, 
      user 
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error occurred during role update" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, onlineDrivers, totalRevenue] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
      }),
      User.countDocuments({ role: "delivery", isOnline: true }),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    res.status(200).json({
      totalOrders,
      onlineDrivers,
      revenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};

export const toggleStock = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isActive = !product.isActive;
    await product.save();

    res.json({
      message: "Stock status updated",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
};

export const allOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    const orders = await Order.find(filter)
      .populate("customer", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const allUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search && search.trim() !== "") {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(filter)
      .select("-password") 
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};
