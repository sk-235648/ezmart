// app/api/cart/route.js
import { connectDB } from "@/lib/db";
import Cart from "@/models/cart";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  await connectDB("ezmart-admin");

  try {
    const { userId } = await verifyToken();

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    return Response.json({
      success: true,
      cart: cart || { items: [] },
    });
  } catch (err) {
    console.error("❌ Cart GET error:", err);
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req) {
  await connectDB("ezmart-admin");

  try {
    const { productId, size, color, quantity, price } = await req.json();

    const userId = await verifyToken(); // ✅ already a string

    console.log("✅ Received userId:", userId);
    console.log("🛒 productId:", productId);

    if (!productId || !quantity || !price) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await Cart.addItemToCart(userId, {
      productId,
      size,
      color,
      quantity,
      price,
    });

    return Response.json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (err) {
    console.error("❌ Cart POST error:", err);
    const status = err.message === "Unauthorized" ? 401 : 500;
    return Response.json(
      { success: false, message: err.message || "Internal server error" },
      { status }
    );
  }
}

export async function PUT(req) {
  await connectDB("ezmart-admin");

  try {
    const { userId } = await verifyToken();
    const { productId, quantity } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return Response.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
      return Response.json({ success: false, message: "Item not found" }, { status: 404 });
    }

    item.quantity = quantity;
    await cart.save();

    return Response.json({ success: true, message: "Quantity updated", cart });
  } catch (err) {
    console.error("❌ Cart PUT error:", err);
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req) {
  await connectDB("ezmart-admin");

  try {
    const { userId } = await verifyToken();
    const { productId } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return Response.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    return Response.json({ success: true, message: "Item removed", cart });
  } catch (err) {
    console.error("❌ Cart DELETE error:", err);
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}