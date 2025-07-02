import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";
import Cart from "@/models/cart";

export async function POST(req) {
  await connectDB("ezmart");

  try {
    const body = await req.json();
    const { productId, quantity = 1, color, size, price, name, image, storedUserId } = body;
    
    console.log("Cart POST received:", { productId, quantity, color, size, price, name });
    if (storedUserId) console.log("Received storedUserId:", storedUserId);

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get user ID from token
    let userId;
    try {
      const tokenData = await verifyToken();
      userId = tokenData.userId;
      console.log("Token userId:", userId);
    } catch (tokenError) {
      // If no token, use storedUserId if available
      if (!storedUserId) {
        return Response.json(
          { success: false, message: "Authentication required", isAuthenticated: false },
          { status: 401 }
        );
      }
      userId = storedUserId;
    }
    
    // Use stored user ID if available and different from token ID
    const finalUserId = storedUserId || userId;
    console.log("Using finalUserId:", finalUserId);
    
    const userObjectId = new mongoose.Types.ObjectId(finalUserId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId: userObjectId });
    console.log("Found existing cart:", cart ? "Yes" : "No");

    if (cart) {
      // Check if this product (with same color and size) already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId.toString() &&
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

    // Prepare response
    const response = Response.json({
      success: true,
      cart: updatedCart,
      userId: finalUserId,
      message: "Cart updated",
    });

    // Set userId cookie for guest users
    if (storedUserId && (!userId || storedUserId !== userId)) {
      response.headers.set(
        'Set-Cookie',
        `userId=${finalUserId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}` // 1 week
      );
    }

    return response;
  } catch (err) {
    console.error("Cart POST error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await connectDB("ezmart");

  try {
    let userId;
    let isAuthenticated = true;

    try {
      const tokenData = await verifyToken();
      userId = tokenData.userId;
      console.log("GET: Token userId:", userId);
    } catch (tokenError) {
      isAuthenticated = false;
      // For unauthenticated users, try to get userId from cookie
      const cookieHeader = req.headers.get('cookie');
      const cookies = new Map(
        cookieHeader?.split(';').map(c => {
          const [key, val] = c.trim().split('=');
          return [key, val];
        }) || []
      );
      userId = cookies.get('userId');
      console.log("GET: Cookie userId:", userId);
    }

    // Try to get userId from query params as fallback
    if (!userId) {
      const url = new URL(req.url);
      userId = url.searchParams.get('userId');
      console.log("GET: Query param userId:", userId);
    }

    if (!userId) {
      console.log("GET: No userId found, returning empty cart");
      return Response.json({
        success: true,
        cart: { items: [] },
        isAuthenticated: false
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("GET: Fetching cart for userId:", userId);

    // Try to find cart
    let cart = await Cart.findOne({ userId: userObjectId }).lean();

    // If no cart found, return empty
    if (!cart) {
      console.log("GET: No cart found - returning empty");
      return Response.json({
        success: true,
        cart: { items: [] },
        userId,
        isAuthenticated
      });
    }

    console.log("GET: Found cart with items:", cart.items.length);
    // Log each item for debugging
    cart.items.forEach((item, index) => {
      console.log(`GET: Item ${index}:`, {
        productId: item.productId.toString(),
        name: item.name,
        quantity: item.quantity
      });
    });

    return Response.json({
      success: true,
      cart,
      userId,
      isAuthenticated
    });

  } catch (err) {
    console.error("❌ Cart GET error:", err);
    return Response.json(
      { 
        success: false, 
        message: err.message || "Error fetching cart",
        isAuthenticated: false
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB("ezmart");

  try {
    let userId;
    try {
      const tokenData = await verifyToken();
      userId = tokenData.userId;
    } catch (tokenError) {
      // For unauthenticated users, try to get userId from cookie
      const cookieHeader = req.headers.get('cookie');
      const cookies = new Map(
        cookieHeader?.split(';').map(c => {
          const [key, val] = c.trim().split('=');
          return [key, val];
        }) || []
      );
      userId = cookies.get('userId');
      
      if (!userId) {
        return Response.json(
          { success: false, message: "Authentication required", isAuthenticated: false },
          { status: 401 }
        );
      }
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

export async function PUT(req) {
  await connectDB("ezmart");

  try {
    let userId;
    try {
      const tokenData = await verifyToken();
      userId = tokenData.userId;
    } catch (tokenError) {
      // For unauthenticated users, try to get userId from cookie
      const cookieHeader = req.headers.get('cookie');
      const cookies = new Map(
        cookieHeader?.split(';').map(c => {
          const [key, val] = c.trim().split('=');
          return [key, val];
        }) || []
      );
      userId = cookies.get('userId');
      
      if (!userId) {
        return Response.json(
          { success: false, message: "Authentication required", isAuthenticated: false },
          { status: 401 }
        );
      }
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return Response.json(
        { success: false, message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { 
        userId: userObjectId,
        "items.productId": new mongoose.Types.ObjectId(productId)
      },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) {
      return Response.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      cart,
      message: "Cart item quantity updated",
    });
  } catch (err) {
    console.error("Cart PUT error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}