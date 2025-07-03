import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Wishlist from "@/models/wishlist";

// Get user's wishlist
export async function GET() {
  await connectDB("ezmart");

  try {
    const { userId } = await verifyToken();
    
    // Find wishlist
    const wishlist = await Wishlist.findOne({ userId })
      .populate('products.productId', 'title price images');
    
    if (!wishlist) {
      return Response.json({
        success: true,
        wishlist: { products: [] } // Return empty wishlist if not found
      });
    }

    return Response.json({
      success: true,
      wishlist
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
  await connectDB("ezmart");

  try {
    const { productId } = await req.json();
    const { userId } = await verifyToken();

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
  await connectDB("ezmart");

  try {
    const { productId } = await req.json();
    const { userId } = await verifyToken();

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