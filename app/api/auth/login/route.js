import getUserModel from '@/models/user';
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const User = await getUserModel();
    const user = await User.findOne({ email });
    
    if (!user) {
      return Response.json(
        { success: false, message: "Invalid credentials" }, // Generic message for security
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid credentials" }, // Generic message for security
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { _id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

   await  cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return Response.json(
      { 
        success: true, 
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}