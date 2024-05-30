import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongoDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected!",conn.connection.host);

    } catch(err){
        console.log("Error Connecting to MONGODB:",err.message)
        process.exit(1);
    }
}

export default connectMongoDB;