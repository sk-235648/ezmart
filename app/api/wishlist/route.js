import { headers } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/wishlist";
import Product from "@/models/Product"; // Import Product model

// Get user's wishlist
export async function GET() {
  try {
    await connectDB("ezmart");
    const cookieHeader = headers().get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return Response.json(
        { success: false, message: "No token found" },
        { status: 401 }
      );
    }

    const { _id: userId } = await verifyToken(token);
    
    // Find wishlist without populate first
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      return Response.json({
        success: true,
        wishlist: { products: [] } // Return empty wishlist if not found
      });
    }

    // Manually populate product details
    const populatedProducts = [];
    for (const item of wishlist.products) {
      try {
        const product = await Product.findById(item.productId);
        if (product) {
          populatedProducts.push({
            productId: {
              _id: product._id,
              title: product.title,
              price: product.price,
              images: product.images
            }
          });
        }
      } catch (err) {
        console.error("Error populating product:", err);
      }
    }

    // Return the wishlist with populated products
    return Response.json({
      success: true,
      wishlist: { products: populatedProducts }
    });
  } catch (err) {
    console.error("Wishlist GET error:", err);
    return Response.json(
      { success: false, message: "Error fetching wishlist" },
      { status: 500 }
    );
  }
}

// Add product to wishlist
export async function POST(req) {
  try {
    await connectDB("ezmart");
    const cookieHeader = headers().get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return Response.json(
        { success: false, message: "No token found" },
        { status: 401 }
      );
    }

    const { _id: userId } = await verifyToken(token);
    const { productId } = await req.json();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product is already in wishlist
    const existingWishlist = await Wishlist.findOne({
      userId,
      'products.productId': productId
    });

    if (existingWishlist) {
      // Product already in wishlist, remove it (toggle functionality)
      await Wishlist.updateOne(
        { userId },
        { $pull: { products: { productId } } }
      );

      return Response.json({
        success: true,
        liked: false,
        message: "Product removed from wishlist"
      });
    }

    // Product not in wishlist, add it
    await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { products: { productId } } },
      { upsert: true, new: true }
    );

    return Response.json({
      success: true,
      liked: true,
      message: "Product added to wishlist"
    });
  } catch (err) {
    console.error("Wishlist POST error:", err);
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// Check if a product is in the wishlist
export async function PUT(req) {
  try {
    await connectDB("ezmart");
    const cookieHeader = headers().get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return Response.json(
        { success: false, message: "No token found" },
        { status: 401 }
      );
    }

    const { _id: userId } = await verifyToken(token);
    const { productId } = await req.json();

    if (!productId) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product is in wishlist
    const isLiked = await Wishlist.exists({
      userId,
      'products.productId': productId
    });

    return Response.json({
      success: true,
      isLiked: !!isLiked
    });
  } catch (err) {
    console.error("Wishlist PUT error:", err);
    return Response.json(
      { success: false, message: "Error checking wishlist status" },
      { status: 500 }
    );
  }
}