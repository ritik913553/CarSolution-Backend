import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  budget: {
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
  bid:[
    {
       user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
       },
       amount :{
        type:Number,
        required:true
       },
       bidAt :{
        type:Date,
        default:Date.now()
       }
    }
  ]
});

const Post = mongoose.model("Post", postSchema);
export default Post;
