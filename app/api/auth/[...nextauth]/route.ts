import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const models = require("@/app/models");
const { Managers } = models.models;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@x" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        try
        {
          let user = await Managers.findOne({
            where: {
              email: credentials.email,
            },
          });

        // simple auth
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return {
            id: user.email,
            // role: user.role, We should authenticate against a common table, and 
            // pull the roll from said table
            role: "manager", // Hard-coding due to missing data
            schoolID: user.schoolID
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
      catch(err) {
        //console.log(err);
        return null;
      }

      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn : '/login',
    error: '/login'
  },
});

export { handler as GET, handler as POST };
