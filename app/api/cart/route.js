//api/cart/route.js
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
export async function GET() {
  await connectDB("ezmart");

  try {
    const { userId } = await verifyToken();
    
    // Find cart and populate product details if needed
    const cart = await Cart.findOne({ userId }).lean(); // .lean() for better performance
    
    if (!cart) {
      return Response.json({
        success: true,
        cart: { items: [] } // Return empty cart if not found
      });
    }

    return Response.json({
      success: true,
      cart
    });
  } catch (err) {
    console.error("Cart GET error:", err);
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
    const { productId } = await req.json();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find and update the cart
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
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
      message: "Item removed from cart"
    });
  } catch (err) {
    console.error("Cart DELETE error:", err);
    return Response.json(
      { 
        success: false, 
        message: err.message || "Server error during item removal" 
      },
      { status: 500 }
    );
  }
}