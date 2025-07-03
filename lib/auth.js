import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function verifyToken() {
  const cookieStore = await cookies(); // ✅ Added await here
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("No token found");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.id };
  } catch (err) {
    throw new Error("Invalid token");
  }
}
