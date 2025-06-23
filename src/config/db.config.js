import mongoose from "mongoose";
const DB_NAME = "ecommerce";

const connectDB = async ()=>{
    try {
       const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
       console.log(`\n MOngoDb connected !! DB Host:${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongodb connection error:",error)
        process.exit(1)
        
    }
}

export default connectDB;