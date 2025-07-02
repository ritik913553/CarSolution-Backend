import Car from "../models/car.model.js";
import mongoose from "mongoose";

import { uploadOnCloudinary } from "../config/cloudinary.config.js";

const createCar = async (req, res) => {
  try {
    const {
      name,
      model,
      brand,
      price,
      carType,
      variant,
      fuelType,
      transmission,
      image,
      description,
    } = req.body;

    console.log("Req : ",req.body)

    // Validation
    if (
      !name ||
      !model ||
      !brand ||
      !price ||
      !carType ||
      !variant ||
      !fuelType ||
      !transmission
      
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageLocalPath = req.file.path
    // console.log(imageLocalPath)
    const imageUrl = await uploadOnCloudinary(imageLocalPath)

    // console.log("Image url :" ,imageUrl)

    const car = await Car.create({
      name,
      model,
      brand,
      price,
      carType,
      variant,
      fuelType,
      transmission,
      image:imageUrl.secure_url,
      description,
    });

    res.status(201).json({
      message: "Car created successfully",
      car,
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    const allowedFields = [
      "name",
      "model",
      "brand",
      "price",
      "carType",
      "variant",
      "fuelType",
      "transmission",
      "isAvailable",
      "description",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file) {
      const localImagePath = req.file.path;

      try {
        const { secure_url } = await uploadOnCloudinary(localImagePath);
        updates.image = secure_url;
      } finally {
        // Always attempt to remove temp file
        await fs.unlink(localImagePath).catch(() => {});
      }
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

   
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json({
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getAllCars = async (req, res) => {
  try {
    // Check if user is admin (assuming you have middleware that sets req.user)
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized: Only admin users can access all cars" 
      });
    }

    // Get query parameters
    const { 
      page = 1, 
      limit = 10, 
      sort = "createdAt:desc",
      ...filters 
    } = req.query;

    // Parse sorting
    const [sortField, sortOrder] = sort.split(":");
    const sortOptions = { [sortField]: sortOrder === "desc" ? -1 : 1 };

    // Build query
    const query = Car.find(filters)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Car.countDocuments(filters);

    const cars = await query.exec();

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};


export { createCar, updateCar ,getAllCars};
