//api/cart/route.js
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Cart from "@/models/cart";
import Product from "@/models/Product";

export async function POST(req) {
  await connectDB("ezmart");

  try {
    const {
      productId,
      quantity = 1,
      color,
      size
    } = await req.json();

    // ✅ Get token from cookie header
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) throw new Error("No token found");
    const { _id: userId } = await verifyToken(token);

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch product details to get price, name, and image
    const product = await Product.findById(productId);
    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if the item already exists in the cart
    const existingCart = await Cart.findOne({ userId });
    
    if (existingCart) {
      // Check if an item with the same productId, color, and size already exists
      const existingItem = existingCart.items.find(item => 
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
      );
      
      if (existingItem) {
        return Response.json({
          success: false,
          message: "This item is already in your cart"
        }, { status: 400 });
      }
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
            price: product.price,
            name: product.title,
            image: product.images[0]
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
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) throw new Error("No token found");
    const { _id: userId } = await verifyToken(token);

    // Find cart without populate
    const cart = await Cart.findOne({ userId });

    if (!cart) {
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
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) throw new Error("No token found");
    const { _id: userId } = await verifyToken(token);

    const { productId } = await req.json();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

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
      message: "Item removed from cart",
    });
  } catch (err) {
    console.error("Cart DELETE error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error during item removal" },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  await connectDB("ezmart");

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) throw new Error("No token found");
    const { _id: userId } = await verifyToken(token);

    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return Response.json(
        { success: false, message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) {
      return Response.json(
        { success: false, message: "Cart or item not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      cart,
      message: "Quantity updated successfully",
    });
  } catch (err) {
    console.error("Cart PUT error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error during quantity update" },
      { status: 500 }
    );
  }
}