// lib/auth.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken() {
  try {
    const cookieStore = await cookies(); // ✅ await required now
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("No token");

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const userId = payload.userId?.toString() || payload._id?.toString(); // 🛠 fallback if structure differs

    if (!userId) throw new Error("Invalid token payload");

    console.log("✅ Verified UserID:", userId);
    return userId;
  } catch (err) {
    console.error("❌ Auth error:", err);
    throw new Error("Unauthorized");
  }
}
