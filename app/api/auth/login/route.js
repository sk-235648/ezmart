// app/api/login/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Final check – create JWT with user._id
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return Response.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    return Response.json({ success: false, message: "Login failed" }, { status: 500 });
  }
}
