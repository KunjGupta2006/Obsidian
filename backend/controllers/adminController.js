import Order from "../models/orderSchema.js";
import User from "../models/userSchema.js";
import Watch from "../models/watchSchema.js";

// GET /api/admin/stats — dashboard overview
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalWatches,
      revenueData,
      lowStockWatches,
      recentOrders,
      orderStatusBreakdown,
      paymentStatusBreakdown,
    ] = await Promise.all([
      // counts
      Order.countDocuments(),
      User.countDocuments({ role: "client" }),
      Watch.countDocuments(),

      // total revenue from paid orders only
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // watches with quantity <= 3
      Watch.find({ quantity: { $lte: 3 } })
        .select("title brand quantity image")
        .sort({ quantity: 1 })
        .limit(10),

      // last 5 orders
      Order.find()
        .populate("user", "fullname email")
        .sort({ createdAt: -1 })
        .limit(5),

      // breakdown by order status
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),

      // breakdown by payment status
      Order.aggregate([
        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      ]),
    ]);

    return res.status(200).json({
      stats: {
        totalOrders,
        totalUsers,
        totalWatches,
        totalRevenue: revenueData[0]?.total || 0,
      },
      lowStockWatches,
      recentOrders,
      orderStatusBreakdown,
      paymentStatusBreakdown,
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch stats", error: err.message });
  }
};

// GET /api/admin/stats/revenue — monthly revenue chart data
export const getMonthlyRevenue = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // fill in months with 0 revenue so frontend chart has all 12 points
    const filledData = Array.from({ length: 12 }, (_, i) => {
      const found = monthlyRevenue.find((r) => r._id.month === i + 1);
      return {
        month: i + 1,
        revenue: found?.revenue || 0,
        orders: found?.orders || 0,
      };
    });

    return res.status(200).json({ year: Number(year), data: filledData });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch revenue data", error: err.message });
  }
};

// GET /api/admin/users — all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch users", error: err.message });
  }
};

// PUT /api/admin/users/:id/role — promote or demote user
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["client", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // prevent admin from demoting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User role updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Cannot update role", error: err.message });
  }
};

// DELETE /api/admin/users/:id — delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Cannot delete user", error: err.message });
  }
};

// GET /api/admin/orders/:id
export const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullname email avatar") 
      .populate({
        path: "items.watch",
        select: "title brand price image referenceNumber" // Ensuring specific luxury fields are included
      });

    if (!order) {
      return res.status(404).json({ message: "Acquisition record not found in registry" });
    }

    // Must return an object with the key 'order' to match your adminSlice
    return res.status(200).json({ order });
  } catch (err) {
    // Handle invalid ObjectIDs or server crashes
    return res.status(500).json({ 
      message: "Database retrieval error", 
      error: err.message 
    });
  }
};