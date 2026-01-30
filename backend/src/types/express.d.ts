import { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends Partial<PrismaUser> {
      id: string;
      email: string;
      role?: string;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
