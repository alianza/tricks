import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  // Configure authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      console.log('session', { session, user, token });
      session.accessToken = token.accessToken;
      session.user.id = token.id || token.sub;
      return session;
    },
    async jwt({ token, account, user, profile }) {
      console.log('jwt', { token, account, user, profile });
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.id = profile.id;
      }
      return token;
    },
  },
};
export default NextAuth(authOptions);
