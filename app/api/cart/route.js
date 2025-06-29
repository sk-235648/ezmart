import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Cart from "@/models/cart";
export async function POST(req) {
  await connectDB("ezmart");

  try {
    const { productId, quantity = 1, color, size, price, name, image } = await req.json();
    const { userId } = await verifyToken();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          items: {
            productId,
            quantity,
            color,
            size,
            price,
            name,
            image
          } 
        } 
      },
      { new: true, upsert: true }
    );

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