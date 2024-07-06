import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const models = require("@/app/models");
const { Users, Recruiters,Students, Managers } = models.models;
import bcrypt from "bcryptjs";
import logger from 'lib/logger';

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
          const user = await Users.findOne({
            where: {
              email: credentials.email,
            },
          });

        const credentialsMatch = await bcrypt.compare(credentials.password, user.password);
        if (user && credentialsMatch) {
          const roleId =  await getUsersRoleId(user.id, user.role);
          return {
            id: user.id,
            firstName: user.first_name,
            email : user.email,
            role: user.role,
            roleId : roleId,
            profileComplete: user.profile_complete,
            schoolID: user.school_id
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
      catch(err) {
        logger.error(err);
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
    signIn: process.env.NEXTAUTH_FORM !== 'default' ? '/login' : '',
    error: process.env.NEXTAUTH_FORM !== 'default' ? '/login' : '',
  },
});


async function getUsersRoleId(userId,role){
  const filter = { where: { user_id: userId } };

  switch(role) {
    case 'recruiter':
      const recruiter = await Recruiters.findOne(filter);
      return recruiter.id;
    case 'manager':
      const manager = await Managers.findOne(filter);
      return manager.id;
    case 'student':
      const student = await Students.findOne(filter);
      return student.id;
    default:
      return ''
  }

  throw new Error("Invalid user role: " + role);
}


export { handler as GET, handler as POST };
