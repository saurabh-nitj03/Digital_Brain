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
const constant_1 = require("./utils/constant");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, connect_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", true);
app.use((0, cors_1.default)({
    // origin: "*",
    origin: "https://digitalbrain-l3f7.onrender.com",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.listen(constant_1.port);
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use("/api/v1/content", content_route_1.default);
app.use("/api/v1/brain", brain_route_1.default);
app.use("/api/v1", user_routes_1.default);
