import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()
const connectionString: string = process.env.MONGODB_URI!;
console.log(connectionString)
const connectToDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            autoIndex: true
        })
        console.log('Connected to Mongodb Atlas');} catch (error) {
        console.error(error);
    }
}
export default connectToDB 