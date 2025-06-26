// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // config here...
    })
  ],
 callbacks: {
  async session({ session, token }) {
    session.user.id = token.id;
    return session;
  },
  async jwt({ token, user }) {
    if (user) token.id = user.id;
    return token;
  }
},
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
