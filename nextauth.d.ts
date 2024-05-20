export enum Role {
  student = "student",
  admin = "admin",
  recruiter = "recruiter",
}

declare module "next-auth" {
  interface User {
    id: string;
    roleId: string;
    schoolID: string;
    role?: Role;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roleId: string;
    schoolID: string;
    role?: Role;
  }
}