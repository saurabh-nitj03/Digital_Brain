declare global{
    namespace Express{
        export interface Request{
            userId?:string;
        }
    }
}

import express from "express";
import connectToDB from "./db/connect";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes";
import contentRoutes from "./routes/content.route";
import brainRoutes from "./routes/brain.route"
// import chatRoutes from "./routes/chat.routes"
import { port } from "./utils/constant";
import dotenv from "dotenv"
import { cloudinaryConnect } from "./utils/cloudinary";
dotenv.config()

connectToDB();
const app=express();
import Chunk from "./model/chunks";
import chunkText from "./utils/chunkText";
// import { generateEmbeddings } from "./utils/embed";
import { storeChunks } from "./utils/pinecone";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: "*",
    origin:["http://localhost:5173", "https://digitalbrain-l3f7.onrender.com"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);
cloudinaryConnect();
app.set("trust proxy", 1);

app.listen(port)

app.get('/', (req, res) => {
  res.send('Digital Brain AI Agent API is running!');  
});

// app.post("/upload",async(req:any,res:any)=>{
//  try{ const {userId,content}=req.body;
//   let text="";
//   const chunks=await chunkText(content);
//   const embedChunks=await generateEmbeddings(chunks);

//   const result = await storeChunks(userId,embedChunks);
//   return res.send(result)
// }catch(err){
//   return res.send(err);
// }

// })

app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/brain", brainRoutes);
// app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1", userRoutes);

console.log(`Server running on port ${port}`);
