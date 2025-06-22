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
import { port } from "./utils/constant";
import dotenv from "dotenv"

dotenv.config()


connectToDB();
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.listen(port)

app.get('/', (req, res) => {
  res.send('Hello World');  
});

app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/brain", brainRoutes);
app.use("/api/v1", userRoutes);
