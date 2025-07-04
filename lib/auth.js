import { cookies } from "next/headers"; 
import jwt from "jsonwebtoken";

export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure we're returning the user ID with the _id property
    return { _id: decoded._id, ...decoded };
  } catch (err) {
    throw new Error("Invalid token");
  }
}
