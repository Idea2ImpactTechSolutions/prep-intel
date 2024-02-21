import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Managers from "../../../../app/models/Managers";
// const { Managers } = models;

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

        console.log("authorize", credentials);

        const email = credentials.email;
        const password = credentials.password;
        const users = await Managers.findOne({ where: { email: email } });
        console.log({ email: email, password: password });

        // simple auth
        if (users.includes(email) && password === "dbpass") {
          // Any object returned will be saved in `user` property of the JWT
          return {
            id: email, // Required field in return type definition
            email: email,
            role: email.split("@")[0],
            schoolID: "b14e03a9-656a-4726-9d38-6f09c912a543",
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
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
  pages: {},
});

export { handler as GET, handler as POST };
