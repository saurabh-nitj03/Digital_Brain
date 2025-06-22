
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../utils/constant";


export const userMiddleware = (req: any, res: any, next: any) => {
  let token = req.headers["authorization"];
  console.log(req.cookie);
  if (!token) {
    token = req.cookies?.jwt;
    // console.log(token);
  }

  if (!token) {
    return res.status(401).json({ 
      success:false,
      message: "User not Authenticated" });

  }

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };
    if (decoded) {
      if (typeof decoded === "string") {
       return res.status(403).json({
          success:false,
          message: "you are not logged in"
        })
        
      }
    }
    req.userId = decoded.id;
    next();
  } catch (err: any) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
