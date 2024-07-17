
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

export enum Role {
  student = "student",
  admin = "admin",
  manager = "manager",
  recruiter = "recruiter",
}

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    roleId: string; // The student/recruiter/admin id associated with the given user
    schoolID: string;
    role?: Role;
    userIsActive: boolean;
    profileComplete: boolean;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    roleId: string;
    schoolID: string;
    role: Role;
    userIsActive: boolean;
    profileComplete: boolean;
  }
}