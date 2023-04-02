import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure authentication providers
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
    // attach user id to session
    async session({ session, user, token }) {
      session.user.id = token.id || token.sub;
      return session;
    },
    // attach user id to token
    async jwt({ token, account, user, profile }) {
      user && (token.id = user.id);
      account && (token.id = profile.id);
      return token;
    },
  },
};
export default NextAuth(authOptions);
