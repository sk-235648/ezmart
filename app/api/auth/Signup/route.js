import getUserModel from '@/models/user';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ message: "Password must be at least 8 characters" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const User = await getUserModel();
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}