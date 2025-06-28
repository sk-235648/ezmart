import { connectDB } from "@/lib/db";
import Cart from "@/models/cart";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  await connectDB("ezmart"); // Changed to 'ezmart' database

  try {
    const { userId } = await verifyToken();

    const cart = await Cart.findOne({ userId });
    return Response.json({
      success: true,
      cart: cart || { items: [] }
    });
  } catch (err) {
    console.error("Cart GET error:", err);
    return Response.json(
      { success: false, message: "Unauthorized" }, 
      { status: 401 }
    );
  }
}

export async function POST(req) {
  await connectDB("ezmart"); // Changed to 'ezmart' database

  try {
    const { productId, quantity = 1, color, size } = await req.json();
    const { userId } = await verifyToken();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.addItem(userId, {
      productId,
      quantity,
      color,
      size
    });

    return Response.json({
      success: true,
      cart,
      message: "Item added to cart"
    });
  } catch (err) {
    console.error("Cart POST error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await connectDB("ezmart"); // Changed to 'ezmart' database

  try {
    const { userId } = await verifyToken();
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return Response.json(
        { success: false, message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.updateQuantity(userId, productId, quantity);
    return Response.json({
      success: true,
      cart,
      message: "Cart updated"
    });
  } catch (err) {
    console.error("Cart PUT error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB("ezmart"); // Changed to 'ezmart' database

  try {
    const { userId } = await verifyToken();
    const { productId } = await req.json();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.removeItem(userId, productId);
    return Response.json({
      success: true,
      cart,
      message: "Item removed from cart"
    });
  } catch (err) {
    console.error("Cart DELETE error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}