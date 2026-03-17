import { Role } from "../models/types";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        email: string;
        role: Role;
      };
      csrfToken?: string;
    }
  }
}

export {};
