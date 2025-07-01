import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    carType: {
      type: String,
      required: true,
      enum: [
        "SUV",
        "Sedan",
        "Hatchback",
        "Truck",
        "Coupe",
        "Convertible",
        "Minivan",
        "Wagon",
      ],
    },
    variant: {
      type: String,
      required: true,
      enum: ["lower", "mid", "higher"],
    },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Manual", "Automatic"],
    },
    image: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
