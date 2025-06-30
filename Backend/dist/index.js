"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_1 = __importDefault(require("./db/connect"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const content_route_1 = __importDefault(require("./routes/content.route"));
const brain_route_1 = __importDefault(require("./routes/brain.route"));
// import chatRoutes from "./routes/chat.routes"
const constant_1 = require("./utils/constant");
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("./utils/cloudinary");
dotenv_1.default.config();
(0, connect_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    // origin: "*",
    origin: ["http://localhost:5173", "https://digitalbrain-l3f7.onrender.com"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
(0, cloudinary_1.cloudinaryConnect)();
app.set("trust proxy", 1);
app.listen(constant_1.port);
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
app.use("/api/v1/content", content_route_1.default);
app.use("/api/v1/brain", brain_route_1.default);
// app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1", user_routes_1.default);
console.log(`Server running on port ${constant_1.port}`);
