import { Request, User } from 'express';
import { JwtPayload } from './jwt-payload';

declare global {
  interface User extends JwtPayload {}

  interface Request {
    user?: JwtPayload;
  }
}
