// src/shared/types/express.d.ts
import { User } from 'generated/prisma';
import type { Session } from 'express-session';

declare global {
  namespace Express {
    interface User {
      id: string;
      userName: string;
      email: string;
      firstName: string;
      lastName: string;
      avatar?: string;
      bio?: string;
      createdAt: Date;
      updatedAt: Date;
    }

    interface Request {
      user?: User;
      session?: Session;
      sessionID?: string;
    }
  }
}

export {};