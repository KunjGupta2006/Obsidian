import mongoose from "mongoose";
import Watch from "../models/watchSchema.js";

// GET /api/watches - with optional search, filter, pagination
export const getwatches = async (req, res) => {
  try {
    const {
      search,
      brand,
      condition,
      movement,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Full-text search using the weighted index
    if (search) {
      query.$text = { $search: search };
    }

    if (brand) query.brand = { $regex: brand, $options: "i" };
    if (condition) query.condition = condition;
    if (movement) query["specs.movement"] = movement;
    if (inStock !== undefined) query.inStock = inStock === "true";
    if (featured !== undefined) query.featured = featured === "true";

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortObj = {};
    // if text search, also allow sorting by score
    if (search) {
      sortObj.score = { $meta: "textScore" };
    } else {
      sortObj[sort] = order === "asc" ? 1 : -1;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Watch.countDocuments(query);

    const watches = await Watch.find(
      query,
      search ? { score: { $meta: "textScore" } } : {}
    )
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      watches,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch watches", error: err.message });
  }
};

// GET /api/watches/:id
export const getWatchById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const watch = await Watch.findById(id);

    if (!watch) {
      return res.status(404).json({ message: "Watch not found" });
    }

    return res.status(200).json({ watch });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch watch", error: err.message });
  }
};

// POST /api/watches - admin only
export const createWatch = async (req, res) => {
  try {
    const {
      title,
      brand,
      referenceNumber,
      price,
      image,
      condition,
      specs,
      description,
      quantity,
      featured,
    } = req.body;

    // Required field check (mongoose will also validate, but early feedback is better)
    if (!title || !brand || !price || !image || !description) {
      return res.status(400).json({
        message: "title, brand, price, image, and description are required",
      });
    }

    const watch = await Watch.create({
      title,
      brand,
      referenceNumber,
      price,
      image,
      condition,
      specs,
      description,
      quantity,
      featured,
    });

    return res.status(201).json({ message: "Watch created successfully", watch });
  } catch (err) {
    // Handle mongoose validation errors cleanly
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    return res.status(500).json({ message: "Cannot create watch", error: err.message });
  }
};

// PUT /api/watches/:id - admin only
export const updateWatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const allowedFields = [
      "title",
      "brand",
      "referenceNumber",
      "price",
      "image",
      "condition",
      "specs",
      "description",
      "quantity",
      "featured",
    ];

    // Only pick fields that are actually in the schema
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const watch = await Watch.findByIdAndUpdate(id, updates, {
      new: true,          // return updated doc
      runValidators: true, // run schema validators on update
    });

    if (!watch) {
      return res.status(404).json({ message: "Watch not found" });
    }

    return res.status(200).json({ message: "Watch updated successfully", watch });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    return res.status(500).json({ message: "Cannot update watch", error: err.message });
  }
};

// DELETE /api/watches/:id - admin only
export const deleteWatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const watch = await Watch.findByIdAndDelete(id);

    if (!watch) {
      return res.status(404).json({ message: "Watch not found" });
    }

    return res.status(200).json({ message: "Watch deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Cannot delete watch", error: err.message });
  }
};