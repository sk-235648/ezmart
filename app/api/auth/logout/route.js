import { cookies } from 'next/headers';

export async function POST() {
  try {
    cookies().delete('token');
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false }, { status: 500 });
  }
}