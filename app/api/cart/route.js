import { connectDB } from '@/lib/db';
import Cart from '@/models/cart';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Path to your exported authOption h

export async function POST(req) {
  await connectDB("ezmart-admin");

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { productId, size, color, quantity, price } = body;

  if (!productId || !quantity || !price) {
    return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId &&
              item.size === size &&
              item.color === color
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, size, color, price });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.productId', 'title images price')
      .lean();

    return Response.json({ success: true, message: 'Item added to cart', cart: populatedCart });
  } catch (error) {
    console.error("Cart API error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
