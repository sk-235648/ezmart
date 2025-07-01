//api/cart/route.js
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";
import Cart from "@/models/cart";

export async function POST(req) {
  await connectDB("ezmart");

  try {
    const body = await req.json();
    const { productId, quantity = 1, color, size, price, name, image } = body;

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const { userId } = await verifyToken();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId: userObjectId });

    if (cart) {
      const existingIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
      );

      if (existingIndex !== -1) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId: productObjectId,
          quantity,
          color,
          size,
          price,
          name,
          image,
        });
      }

      await cart.save();
    } else {
      cart = await Cart.create({
        userId: userObjectId,
        items: [
          {
            productId: productObjectId,
            quantity,
            color,
            size,
            price,
            name,
            image,
          },
        ],
      });
    }

    return Response.json({
      success: true,
      cart,
      message: "Cart updated",
    });
  } catch (err) {
    console.error("Cart POST error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB("ezmart");

  try {
    const { userId } = await verifyToken();
    const userObjectId = new mongoose.Types.ObjectId(userId);

    console.log("👉 Fetching cart for:", userObjectId);

    const cart = await Cart.findOne({ userId: userObjectId }).lean();

    console.log("🛒 Cart from DB:", JSON.stringify(cart, null, 2));

    if (!cart || !cart.items || cart.items.length === 0) {
      console.log("⚠️ Empty cart being returned");
      return Response.json({
        success: true,
        cart: { items: [] },
      });
    }

    return Response.json({
      success: true,
      cart,
    });
  } catch (err) {
    console.error("❌ Cart GET error:", err);
    return Response.json(
      { success: false, message: "Error fetching cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB("ezmart");

  try {
    const { userId } = await verifyToken();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { productId } = await req.json();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: userObjectId },
      { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } },
      { new: true }
    );

    if (!cart) {
      return Response.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      cart,
      message: "Item removed from cart",
    });
  } catch (err) {
    console.error("Cart DELETE error:", err);
    return Response.json(
      {
        success: false,
        message: err.message || "Server error during item removal",
      },
      { status: 500 }
    );
  }
}
