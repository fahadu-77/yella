import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "cart is empty" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    let calculatedTotal = 0;
    const processedItems = [];
    for (const item of items) {
      let product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ msg: `product ${item.product} not found` });
      }
      if (product.whStock < item.quantity) {
        return res.status(400).json({
          msg: `Insufficient stock for ${product.name}. Available: ${product.warehouseStock}`,
        });
      }
      calculatedTotal += product.price * item.quantity;
      processedItems.push({
        product: product._id,
        quantity: item.quantity,
      });
      await Product.findOneAndUpdate(
        { _id: item.product, whStock: { $gte: item.quantity } },
        { $inc: { whStock: -item.quantity } },
      );
    }
    const newOrder = new Order({
      customer: req.user.id,
      items: processedItems,
      totalAmount: calculatedTotal,
      address,
      paymentMethod: paymentMethod || "COD",
      otp,
      status: "placed",
    });

    await newOrder.save();

    res.status(201).json({
      msg: "order placed successfully",
      success: true,
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while creating order" });
  }
};

export const updateToPacking = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "packing" },
      { new: true },
    );
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ msg: "some error occured while updating to packing" });
  }
};

export const updateToReadyAndAssign = async (req, res) => {
  try {
    const deliveryBoy = await User.findOne({
      role: "delivery",
      isOnline: true,
      isAvailable: true,
    }).sort({ lastAvailableAt: 1 });
    if (!deliveryBoy) {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: "ready" },
        { new: true },
      );
      return res
        .status(200)
        .json({ msg: "order ready, but no delivery boy avaliable", order });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: "on-the-way",
        deliveryBoy: deliveryBoy._id,
      },
      { new: true },
    );

    deliveryBoy.isAvailable = false;
    await deliveryBoy.save();

    res
      .status(200)
      .json({ msg: "Order assigned", order, deliveryBoy: deliveryBoy.name });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ msg: "error while updating to ready and assigning to delivery" });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const deliveryBoy = await User.findById(req.user.id);
    if (!deliveryBoy) {
      return res.status(404).json({ msg: "delivery boy not found" });
    }

    const completedOrder = await Order.findById(orderId);
    if (!completedOrder) {
      return res.status(404).json({ msg: "order not found" });
    }

    if (String(completedOrder.otp) !== String(otp)) {
      return res
        .status(400)
        .json({ msg: "invalid otp, delivery not completed" });
    }

    completedOrder.status = "delivered";
    await completedOrder.save();

    const readyOrder = await Order.findOne({
      status: "ready",
    }).sort({ createdAt: 1 });

    if (readyOrder) {
      await Order.findByIdAndUpdate(
        readyOrder._id, 
        {
          status: "on-the-way",
          deliveryBoy: deliveryBoy._id,
        },
        { new: true },
      );

      deliveryBoy.isAvailable = false;
      deliveryBoy.lastAssignedAt = Date.now();
    } else {
      deliveryBoy.isAvailable = true;
      deliveryBoy.lastAvailableAt = Date.now();
    }

    await deliveryBoy.save();

    res.status(200).json({
      msg: "order delivered successfully",
      nextOrderAssigned: !!readyOrder,
    });
  } catch (err) {
    res.status(500).json({ msg: "error completing order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error fetchin orders" });
  }
};
