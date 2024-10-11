import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Conneted: ${conn.connection.host}`)
    }catch(error){
        console.error(`Connnection to MongoDB atemt Error: ${error.message}`)
    }
}