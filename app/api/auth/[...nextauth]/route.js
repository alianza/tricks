import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure authentication providers1
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    // attach user id to session (server side)
    async session({ session, user, token }) {
      session.user.id = token.id || token.sub;
      console.log(`token`, token);
      console.log(`session session`, session);
      return session;
    },
    // attach user id to token (client side)
    async jwt({ token, account, user, profile }) {
      user && (token.id = user.id);
      account && (token.id = profile.id);
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
