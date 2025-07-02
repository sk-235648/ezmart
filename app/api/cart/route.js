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
    
    console.log("Cart POST received:", { productId, quantity, color, size, price, name });

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const { userId } = await verifyToken();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId: userObjectId });
    console.log("Found existing cart:", cart ? "Yes" : "No");

    if (cart) {
      // Check if this product (with same color and size) already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += quantity;
        console.log("Updated existing item quantity");
      } else {
        // Add new item to cart
        cart.items.push({
          productId: productObjectId,
          quantity,
          color,
          size,
          price,
          name,
          image,
        });
        console.log("Added new item to existing cart");
      }

      await cart.save();
      console.log("Updated existing cart with new item");
    } else {
      // Create a new cart for this user
      cart = new Cart({
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

      await cart.save();
      console.log("Created new cart for user");
    }

    // Fetch the updated cart to return
    const updatedCart = await Cart.findOne({ userId: userObjectId }).lean();
    console.log("Updated cart items count:", updatedCart.items.length);

    return Response.json({
      success: true,
      cart: updatedCart,
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

    // Use populate to get product details
    let cart = await Cart.findOne({ userId: userObjectId })
      .lean();

    console.log("Raw cart from DB:", cart);

    // If no cart exists for this user, create an empty one
    if (!cart) {
      console.log("Creating empty cart for user");
      cart = { items: [] };
    } else {
      // Log each item in the cart for debugging
      console.log("Cart items found:", cart.items.length);
      cart.items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });
      });
    }

    console.log("🛒 Cart from DB:", JSON.stringify(cart, null, 2));

    return Response.json({
      success: true,
      cart,
    });
  } catch (err) {
    console.error("❌ Cart GET error:", err);
    
    // For authentication errors, return an empty cart with auth status
    if (err.message === "No token found" || err.message === "Invalid token") {
      return Response.json({
        success: true,
        cart: { items: [] },
        isAuthenticated: false
      });
    }
    
    return Response.json(
      { success: false, message: "Error fetching cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB("ezmart");

  try {
    // Try to get user ID with better error handling
    let userId;
    try {
      const tokenData = await verifyToken();
      userId = tokenData.userId;
    } catch (tokenError) {
      return Response.json(
        { success: false, message: "Authentication required", isAuthenticated: false },
        { status: 401 }
      );
    }

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
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
