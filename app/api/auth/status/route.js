import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = await cookies();
  const token =  cookieStore.get('token');

  if (!token) {
    return Response.json({ isAuthenticated: false });
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET);
    return Response.json({ isAuthenticated: true });
  } catch (err) {
    return Response.json({ isAuthenticated: false });
  }
}